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

		modules: {},
		services: services,
	};

	function add_module (name, mod) {
		if (name in modules) {
			logger.error(`module ${name} already defined...`);
			return;
		}
		let module_logger = loggerFactory(name),
			module_options = config.settings[name] || {};

		modules[name] = mod(module_logger, module_options);
		let mod_services = modules[name].services || {};
		for (let service of Object.keys(mod_services)) {
			add_service(name, service, mod_services[service]);
		}
	}

	function add_service (module_name, service_name, service) {
		let name = `${module_name}.${service_name}`;
		if (name in service) {
			logger.error(`service ${name} already defined`);
			return;
		}
		let service_logger = loggerFactory(name),
			options = config.settings[name] || {},
			module = modules[module_name];

		services[name] = service(service_logger, options);

	}


	function start () {
		logger.info(`starting application`);

		let to_activate = [],
			dependencies = [];

		for (let m of Object.keys(modules)) {
			if (('activate' in modules[m]) != ('depends' in modules[m])) {
				logger.error(`Module ${m} need to have 'depends' and 'activate' properties`);
				return;
			}
			if ('activate' in modules[m]) {

				// add activate to list and to deps
			}
		}
		console.log(modules);
		console.log(services);
	}

};

// function makeModule (options) {

// 	return {
// 		service
// 	}
// }

// let loggerFactory = require('./loggerFactory');
// module.exports = loggerFactory;

// let loggerFactory,
// 	logger,
// 	modules = {};
// 	 = Moebius('console', 'debug', {colored: true});
// let logger = loggerFactory('moebius');

