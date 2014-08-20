/*jslint node: true */
'use strict';

let utils = require('../common/utils.js');

module.exports = function (config) {
	let loggerFactory = require('../logger')(config.logger),
		project_name = config.project.name,
		logger = loggerFactory(project_name),
		modules = {},
		services = {};

	logger.info(`loading application`);

	return {
		add_module: add_module,
		start: start,

		modules: modules,
		services: services,
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
	}

	function add_service (module_name, service) {
		let service_name = service.name;
		logger.debug(`loading ${service_name}`);
		let name = `${module_name}.${service_name}`;
		if (name in service) {
			logger.error(`service ${name} already defined`);
			return;
		}
		let service_logger = loggerFactory(name),
			options = config.settings[name] || {},
			module = modules[module_name];

		services[name] = service(service_logger, options);
		services[name].depends = services[name].depends || [];

		if (!('activate' in services[name])) {
			logger.error(`No 'activate' function in service ${name}`);
			return;
		}
	}


	function start () {
		logger.info(`starting services/modules`);

		let to_activate = [],
			dependencies = [];


		for (let s of Object.keys(services)) {
			to_activate.push(s);
			for (let dep of services[s].depends) {
				dependencies.push({from: dep, to: s});
			}
		}

		to_activate = utils.topological_sort(to_activate, dependencies);

		for (let s of to_activate) {
			logger.debug(`activating ${s}`);
			let deps = services[s].depends.map(name => services[name].value);
			services[s].value = services[s].activate(...deps);
		}

		for (let m of Object.keys(modules)) {
			if ('activate' in modules[m]) {
				logger.debug(`activating ${m}`);
				let deps = modules[m].depends.map(name => services[name].value);
				modules[m].activate(...deps);
			}
		}
		logger.info(`application loaded`)
	}

};
