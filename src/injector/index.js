/*jslint node: true */
'use strict';

let _ = require('lodash');

let topological_sort = require('./topological_sort'),
	utils = require('./utils'),
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
	let dep_names = utils.getParamNames(service.config),
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
	service.build_deps = utils.getParamNames(service.build);
	if ('run' in service) {
		service.run_deps = utils.getParamNames(service.run);
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

