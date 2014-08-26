/*jslint node: true */
'use strict';

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
		logger.info(`starting ${module_name}`);

		start_config_phase();

		logger.info('build phase');

		logger.info('run phase');

		logger.info(this);
	},
};

function start_config_phase () {
	logger.info('configuration phase');
	for (let name of Object.keys(services))	{
		let service = services[name];
		// logger.debug(name);
		let dep_names = getParamNames(service.config);
		
		// logger.debug('deps', deps);
	}
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
	services[service_name] = service;
	module.services[service_name] = service;
	return module;
}

function make_constant (module, constant_name, value) {
	if (constant_name in constants) {
		logger.error(`Duplicate constant name: ${constant_name}`);
		return;
	}
	logger.debug('creating constant', constant_name);
	constants[constant_name] = value;
	module.constants[constant_name] = value;
	return module;
}

function getParamNames(fn) {
    let str = fn.toString(),
    	arg_str = str.slice(str.indexOf('(') + 1, str.indexOf(')'));
    return arg_str.match(/([^\s,]+)/g);
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
