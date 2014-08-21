/*jslint node: true */
'use strict';

let topological_sort = require('./topological_sort.js');

module.exports = function (config) {
	let loggerFactory = require('../logger')(config.logger),
		project_name = config.project.name,
		logger = loggerFactory(project_name);

	let modules = {},
		values = {},
		services = {},
		providers = {};

	logger.info(`loading application`);

	return {
		add_module: add_module,
		start: start,

		modules: modules,
		services: services,
		values: values,
	};

	function add_module (mod) {
		let name = mod.name;
		logger.debug(`loading ${name}`);
		if (name in modules) {
			logger.error(`module ${name} already defined...`);
			return;
		}
		let module_logger = loggerFactory(name),
			module_options = config.settings[name] || {};

		modules[name] = mod(module_logger, module_options);
		modules[name].depends = modules[name].depends || [];

		let mod_services = modules[name].services || [];
		for (let service of mod_services) {
			add_service(name, service);
		}

		let mod_values = modules[name].values || [];
		for (let value of mod_values) {
			add_value(name, value);
		}
	}

	function add_service (module_name, service) {
		if (service.name === '') {
			logger.error('Invalid service definition: missing name property');
			return;
		}
		let name = `${module_name}.${service.name}`;
		logger.debug(`loading ${name}`);
		if (is_taken(name)) {
			logger.error(`service ${name} already defined`);
			return;
		}
		let service_logger = loggerFactory(name),
			options = config.settings[name] || {};

		services[name] = service(service_logger, options);
		services[name].depends = services[name].depends || [];

		if (!('start' in services[name])) {
			logger.error(`No 'start' function in service ${name}`);
		}
	}


	function add_value (module_name, service) {
		let name = `${module_name}.${service.name}`;
		logger.debug(`loading ${name}`);
		if (is_taken(name)) {
			logger.error(`Value ${name} already defined`);
			return;
		}

		let value_logger = loggerFactory(name),
			options = config.settings[name] || {};

		let v = service(value_logger, options);

		values[name] = {value: v}; 
	}

	function start () {
		logger.info(`starting services/modules`);

		let to_start = Object.keys(values),
			dependencies = [];


		for (let s of Object.keys(services)) {
			to_start.push(s);
			for (let dep of services[s].depends) {
				dependencies.push({from: dep, to: s});
			}
		}
		to_start = topological_sort(to_start, dependencies);

		for (let s of to_start) {
			let service = get_service(s);
			if ('start' in service) {
				logger.debug(`starting ${s}`);
				let deps = service.depends.map(name => get_service(name).value);
				services[s].value = services[s].start(...deps);

			}
		}

		for (let m of Object.keys(modules)) {
			if ('start' in modules[m]) {
				logger.debug(`starting ${m}`);
				let deps = modules[m].depends.map(name => get_service(name).value);
				modules[m].start(...deps);
			}
		}
		logger.info(`application loaded`);
	}

	function is_taken (name) { //for value/service/provider
		return (name in services) || (name in values);
	}

	function get_service (name) {
		if (name in services) {
			return services[name];
		}
		if (name in values) {
			return values[name];
		}
		logger.error(`Service ${name} is not defined`);
	}

};
