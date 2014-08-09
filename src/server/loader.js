/*jslint node: true */
'use strict';

let utils = require('../common/utils.js');

module.exports = function (module_list, config) {
	let LoggerFactory = require('./logger')(config.logger),
		logger = LoggerFactory.make('loader'),
		modules = [];

	return {
		load () {
			logger.info('Loading modules');
			modules = load_modules([], module_list);
			return this;
		},
		link () {
			logger.info('Linking modules');
			let dependencies = [];
			for (let m of modules) {
				for (let d of m.dependencies) {
					let dep = get_module(d);
					dependencies.push({from:dep, to: m});
				}
			}

			try {
				modules = utils.topological_sort(modules, dependencies);
			}
			catch (e) {
				logger.error(e);
				process.exit(1);
			}

			for (let mod of modules) {
				logger.debug('linking', mod.fullname);
				let deps = mod.dependencies.map(name => get_module(name).module);
				mod.module = mod.link(...deps);
			}
			return this;
		},
		run () {
			logger.info('Running modules');
			for (let mod of modules) {
				if ('run' in mod) {
					logger.debug('running', mod.fullname);
					mod.run(mod.module);
				}
			}
			return this;
		} 
	};

	function load_module(fullname) {
		logger.debug('loading', fullname);
		let module_logger = LoggerFactory.make(fullname);

		let folder = './' + fullname.split('.').join('/');
		let mod = require(folder)(module_logger, config[fullname]);
		mod.fullname = fullname;
		mod.name = fullname.split('.').pop();
		mod.submodules = (mod.submodules || []).map(n => `${fullname}.${n}`);
		mod.dependencies = mod.dependencies || [];
		mod.link = mod.link || function () { return {};};

		return mod;
	}

	function load_modules (loaded, to_load) {
		if (!to_load.length) 
			return loaded;

		let new_module = load_module(to_load[0]),
			rest = to_load.slice(1).concat(new_module.submodules);

		loaded.push(new_module);
		return load_modules(loaded, rest);
	}

	function get_module(fullname) {
		for (let m of modules) {
			if (m.fullname === fullname) return m;
		}
	}
};

