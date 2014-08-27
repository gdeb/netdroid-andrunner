/*jslint node: true */
'use strict';

let _ = require('lodash');

let topological_sort = require('./topological_sort.js'),
	loggerFactory = require('./loggerFactory'),
	logger,
	settings;


let modules = {},
	services = {},
	constants = {};

module.exports = {
	modules: modules,
	services: services,
	constants: constants,

	config (options) {
		loggerFactory.config(options.logger);
		logger = loggerFactory.make('injector');
		settings = options.settings;
	},
	module (name, dependencies) {
		if (!logger) {
			throw new Error('Injector need to be configured first');
		}
		if (!dependencies) {
			if (name in this.modules) {
				return this.modules[name];
			} else {
				logger.error(`Module ${name} does not exist`);
				return;
			}
		}
		if (name in this.modules) {
			logger.error(`Duplicate module name: ${name}`);
			return;
		}
		logger.debug(`creating module ${name}`);
		this.modules[name] = make_module (name, dependencies);
		return this.modules[name];
	},
	start (module_name) {
		logger.debug(`starting ${module_name}`);

		config_phase();
		build_phase();
		run_phase();

	},
	constant (name, value) {
		make_constant(null, name, value);
	}
};

function config_phase () {
	logger.info('--- configuration phase ---');
	for (let name of Object.keys(services))	{
		let service = services[name];
		if ('config' in service) {
			_config_service(name, service);
		}
	}
}

function _config_service (name, service) {
	logger.debug('configuring', name);
	let dep_names = getParamNames(service.config),
		deps = dep_names.map(function (dep_name) {
			if (dep_name === 'logger') {
				return loggerFactory.make(name);
			} else if (!(dep_name in constants)) {
				logger.error(`Dependency '${dep_name}' cannot be found in constants`);
			}
			return constants[dep_name];
		});
	service.config(...deps);
}

function build_phase () {
	logger.info('--- build phase ---');

	let to_build = _.values(services),
		dependencies = [];

	_.each(services, function (service) {
		for (let dep of service.build_deps) {
			if (!(dep in services) && dep !== 'logger'){
				logger.error(`Missing dependency for service ${service.name}: '${dep}'`);
			} else if (dep !== 'logger') {
				dependencies.push({from: services[dep], to: service});
			}
		}
	});

	to_build = topological_sort(to_build, dependencies);

	for (let service of to_build) {
		logger.debug(`building ${service.name}`);
		let deps = service.build_deps.map(function (name) {
			if (name === 'logger') {
				return loggerFactory.make(service.name);
			} else {
				return services[name]._value;
			}

		});
		service._value = service.build(...deps);
		// logger.error(service);
	}
}

function run_phase () {
	logger.info('--- run phase ---');
	_.each(services, function (service) {
		if ('run' in service) {
			run_service(service);
		}
	});
}

function run_service (service) {
	logger.debug(`running ${service.name}`);
	let deps = service.run_deps.map(function (name) {
		if (name === 'logger') {
			return loggerFactory.make(service.name);
		} else {
			return services[name]._value;
		}
	});
	service.run(...deps);
}

function make_module (name, dependencies) {
	let module = {
		name: name,
		dependencies: dependencies,
		service : (...args) => make_service(module, ...args),
		constant: (...args) => make_constant(module, ...args),

		services: {},
		constants: {},
	};
	return module;
}


function make_service (module, service_name, service) {
	if (service_name in services) {
		logger.error(`Duplicate service name: ${service_name}`);
		return;		
	}
	logger.debug('creating service', service_name);
	if ('value' in service && 'build' in service) {
		logger.error(`Service '${service_name}' shouldn't have a value and a config key`);
		return;
	}
	if ('value' in service) {
		service.build = function () { return service.value; };
	}
	if (!('build' in service)) {
		logger.error(`Service ${service_name} should have a 'build' or a 'value' key.`);
		return;
	}
	services[service_name] = service;
	module.services[service_name] = service;
	service.name = service_name;
	service.build_deps = getParamNames(service.build);
	if ('run' in service) {
		service.run_deps = getParamNames(service.run);
	}
	return module;
}

function make_constant (module, constant_name, value) {
	if (constant_name in constants) {
		logger.error(`Duplicate constant name: ${constant_name}`);
		return;
	}
	logger.debug('creating constant', constant_name);
	constants[constant_name] = value;
	if (module) {
		module.constants[constant_name] = value;
		return module;
	}
}


function getParamNames(fn) {
    let str = fn.toString(),
    	arg_str = str.slice(str.indexOf('(') + 1, str.indexOf(')'));
    return arg_str.match(/([^\s,]+)/g) || [];
}

// module.exports = function (config) {
// 	let loggerFactory = require('../logger')(config.logger),
// 		project_name = config.project.name,
// 		logger = loggerFactory(project_name);

// 	let modules = {},
// 		values = {},
// 		services = {},
// 		providers = {};

// 	logger.info(`loading application`);

// 	return {
// 		add_module: add_module,
// 		start: start,

// 		modules: modules,
// 		services: services,
// 		values: values,
// 	};

// 	function add_module (mod) {
// 		let name = mod.name;
// 		logger.debug(`loading ${name}`);
// 		if (name in modules) {
// 			logger.error(`module ${name} already defined...`);
// 			return;
// 		}
// 		let module_logger = loggerFactory(name),
// 			module_options = config.settings[name] || {};

// 		modules[name] = mod(module_logger, module_options);
// 		modules[name].depends = modules[name].depends || [];

// 		let mod_services = modules[name].services || [];
// 		for (let service of mod_services) {
// 			add_service(name, service);
// 		}

// 		let mod_values = modules[name].values || [];
// 		for (let value of mod_values) {
// 			add_value(name, value);
// 		}
// 	}

// 	function add_service (module_name, service) {
// 		if (service.name === '') {
// 			logger.error('Invalid service definition: missing name property');
// 			return;
// 		}
// 		let name = `${module_name}.${service.name}`;
// 		logger.debug(`loading ${name}`);
// 		if (is_taken(name)) {
// 			logger.error(`service ${name} already defined`);
// 			return;
// 		}
// 		let service_logger = loggerFactory(name),
// 			options = config.settings[name] || {};

// 		services[name] = service(service_logger, options);
// 		services[name].depends = services[name].depends || [];

// 		if (!('start' in services[name])) {
// 			logger.error(`No 'start' function in service ${name}`);
// 		}
// 	}


// 	function add_value (module_name, service) {
// 		let name = `${module_name}.${service.name}`;
// 		logger.debug(`loading ${name}`);
// 		if (is_taken(name)) {
// 			logger.error(`Value ${name} already defined`);
// 			return;
// 		}

// 		let value_logger = loggerFactory(name),
// 			options = config.settings[name] || {};

// 		let v = service(value_logger, options);

// 		values[name] = {value: v}; 
// 	}

// 	function add_provider (module_name, provider) {
		
// 	}
	
// 	function start () {
// 		logger.info(`starting services/modules`);

// 		let to_start = Object.keys(values),
// 			dependencies = [];


// 		for (let s of Object.keys(services)) {
// 			to_start.push(s);
// 			for (let dep of services[s].depends) {
// 				dependencies.push({from: dep, to: s});
// 			}
// 		}
// 		to_start = topological_sort(to_start, dependencies);

// 		for (let s of to_start) {
// 			let service = get_service(s);
// 			if ('start' in service) {
// 				logger.debug(`starting ${s}`);
// 				let deps = service.depends.map(name => get_service(name).value);
// 				services[s].value = services[s].start(...deps);

// 			}
// 		}

// 		for (let m of Object.keys(modules)) {
// 			if ('start' in modules[m]) {
// 				logger.debug(`starting ${m}`);
// 				let deps = modules[m].depends.map(name => get_service(name).value);
// 				modules[m].start(...deps);
// 			}
// 		}
// 		logger.info(`application loaded`);
// 	}

// 	function is_taken (name) { //for value/service/provider
// 		return (name in services) || (name in values);
// 	}

// 	function get_service (name) {
// 		if (name in services) {
// 			return services[name];
// 		}
// 		if (name in values) {
// 			return values[name];
// 		}
// 		logger.error(`Service ${name} is not defined`);
// 	}

// };
