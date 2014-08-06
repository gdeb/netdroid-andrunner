/*jslint node: true */
'use strict';

let util = require('util'),
	extend = require('node.extend');

module.exports = function (module_names, config) {
	let Logger = require('./logger')(config.logger),
		logger = new Logger('loader', config.logger.log_level);

	logger.debug('requiring modules...');
	let modules = {},
		app = {};

	for (let name of module_names) {
		let logger = new Logger(name, config.logger[name]),
			module_config = config[name],
			loaded_module = require('./' + name)(logger, module_config);

		if (util.isArray(loaded_module)) {
			app[name] = {};
			for (let submodule of loaded_module) {
				modules[name + '.' + submodule.name] = submodule;
				app[name][submodule.name] = submodule;
			}
		} else {
			let default_module = { dependencies: [] };
			modules[name] = extend(default_module, load_module(name));
			app[name] = modules[name];
		}
	}

	let init_list = Object.keys(modules).sort(compare_modules);

	for (let name of init_list) {
		let mod = modules[name],
			deps = mod.dependencies.map(m => modules[m]);
		logger.debug(`loading ${name}...`);
		mod.init(...deps);
		logger.info(name, 'loaded');
	}

	return app;

	function load_module (name) {
		let logger = new Logger(name, config.logger[name]),
			module_config = config[name];
		return require('./' + name)(logger, module_config);
	}

	function contains(array, elem) {
		return array.indexOf(elem) > -1;
	}

	function compare_modules (mod1, mod2) {
		let mod1_deps = modules[mod1].dependencies,
			mod2_deps = modules[mod2].dependencies;
		if (contains(mod2_deps, mod1))
			return -1;
		if (contains(mod1_deps, mod2))
			return 1;
		return 0;
	}
};

