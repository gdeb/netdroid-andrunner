/*jslint node: true */
'use strict';

let util = require('util'),
	extend = require('node.extend');

module.exports = function (modules, config) {
	let LoggerFactory = require('./logger')(config.logger),
		logger = LoggerFactory.make('loader', config.logger.log_level),
		mod;

	//--------------------------------------------------------------------------
	logger.info('configuration phase...');

	let module_loaders = {};
	for (mod of modules) {
		let module_logger = LoggerFactory.make(mod, config.logger[mod]);
		logger.debug('configuring ' + mod);
		module_loaders[mod] = require('./' + mod)(module_logger, config[mod]);
	}

	//--------------------------------------------------------------------------
	logger.info('loading phase...');

	let application = {},
		load_order = Object.keys(module_loaders).sort(compare_modules);

	for (mod of load_order) {
		let loader = module_loaders[mod],
			dependencies = loader.dependencies.map(m => application[m]);

		logger.debug(`loading ${mod}...`);
		application[mod] = loader.load(...dependencies);
		logger.info(mod, 'loaded');
	}

	return application;
	// ,
	// 	app = {};

	// for (let name of module_names) {

		// if (util.isArray(loaded_module)) {
		// 	app[name] = {};
		// 	for (let submodule of loaded_module) {
		// 		modules[name + '.' + submodule.name] = submodule;
		// 		app[name][submodule.name] = submodule;
		// 	}
		// } else {
			// let default_module = { dependencies: [] };
			// modules[name] = extend(default_module, load_module(name));
			// app[name] = modules[name];
		// }
	// }

	// logger.info('loading phase...');

	// let init_list = Object.keys(modules).sort(compare_modules);

	// for (let name of init_list) {
	// 	let mod = modules[name],
	// 		deps = mod.dependencies.map(m => modules[m]);
	// 	logger.debug(`loading ${name}...`);
	// 	mod.init(...deps);
	// 	logger.info(name, 'loaded');
	// }

	// return app;

	// function load_module (name) {
	// 	let logger = new Logger(name, config.logger[name]),
	// 		module_config = config[name];
	// 	return require('./' + name)(logger, module_config);
	// }

	function contains(array, elem) {
		return array.indexOf(elem) > -1;
	}

	function compare_modules (mod1, mod2) {
		let mod1_deps = module_loaders[mod1].dependencies,
			mod2_deps = module_loaders[mod2].dependencies;
		if (contains(mod2_deps, mod1))
			return -1;
		if (contains(mod1_deps, mod2))
			return 1;
		return 0;
	}
};

