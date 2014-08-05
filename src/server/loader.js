/*jslint node: true */
'use strict';

let extend = require('node.extend');

module.exports = function (module_names, config) {

	let Logger = require('./logger')(config.logger),
		logger = new Logger('loader', config.logger.log_level);


	logger.debug('loading modules');
	let modules = {};
	for (let name of module_names) {
		let default_module = {
			dependencies: [],
			init () {},
		};
		modules[name] = extend(default_module, load_module(name));
	}

	let init_list = module_names.sort(function (mod1, mod2) {
		let mod1_deps = modules[mod1].dependencies || [],
			mod2_deps = modules[mod2].dependencies || [];
		if (contains(mod2_deps, mod1))
			return -1;
		if (contains(mod1_deps, mod2))
			return 1;
		return 0;
	});


	for (let name of init_list) {
		let mod = modules[name],
			deps = mod.dependencies.map(m => modules[m]);
		logger.debug('initializing', name);
		mod.init(...deps);
	}

	logger.debug('loading complete');
	return modules;

	function load_module (name) {
		let logger = new Logger(name, config.logger[name]),
			module_config = config[name];
		return require('./' + name)(logger, module_config);
	}
};


// helpers
function contains(array, elem) {
	return array.indexOf(elem) > -1;
}