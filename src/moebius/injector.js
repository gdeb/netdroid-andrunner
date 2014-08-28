/*jslint node: true */
'use strict';

let _ = require('lodash');

let topological_sort = require('./topological_sort'),
	utils = require('./utils'),
	loggerFactory = require('./loggerFactory');

//---------------------------------------------------------------------
module.exports = class Injector {
	constructor (options) {
		loggerFactory.config(options);
		this.logger = loggerFactory.make('injector');

		this.modules = {};
		this.services = {};
		this.constants = {};
	}
	create_module (name, dependencies = []) {
		if (name in this.modules) {
			this.logger.error(`duplicate module name: ${name}`);
			return;
		}
		this.logger.debug(`creating module ${name}`);
		this.modules[name] = new Module(this, name, dependencies);
		return this.modules[name];
	}
	module (name) {
		if (name in this.modules) {
			return this.modules[name];
		} else {
			this.logger.error(`module ${name} does not exist`);
			return;
		}
	}
	create_constant (name, value) {
		if (name in this.constants) {
			this.logger.error(`duplicate constant name: ${name}`);
		}
		this.logger.debug(`creating constant ${name}, value ${value}`);
		this.constants[name] = value;
	}

	start (module_name) {
		this.logger.debug(`starting ${module_name}...`);
		this.config_phase();
		this.build_phase();
		this.run_phase();
	}

	config_phase () {
		this.logger.info('--- configuration phase ---');
		_.each(this.services, service => service.config(this.constants));
	}

	build_phase () {
		let self = this;
		this.logger.info('--- build phase ---');
		let services = _.filter(this.services, s => s.is_buildable()),
			dependencies = [];

		_.each(services, function (service) {
			for (let dep of service.build_deps) {
				if (!(dep in self.services) && dep !== 'logger'){
					self.logger.error(`Missing dependency for service ${service.name}: '${dep}'`);
				} else if (dep !== 'logger') {
					dependencies.push({from: self.services[dep], to: service});
				}
			}
		});

		let ordered_services = topological_sort(services, dependencies);

		_.each(ordered_services, s => s.build(this.services));
	}

	run_phase () {
		this.logger.info('--- run phase ---');
		_.each(this.services, service => service.run(this.services));
	}
};

//---------------------------------------------------------------------
class Module {
	constructor (parent, name, dependencies) {
		this.name = name;
		this.dependencies = dependencies;
		this.parent = parent;
		this.logger = parent.logger;
		this.services = {};
	}
	service (name, definition) {
		this.logger.debug(`creating service ${this.name}/${name}`);
		if (name in this.parent.services) {
			this.logger.error(`duplicate service name: ${service}`);
			return;					
		}
		var s;
		try {
			s = new Service(name, definition, this.logger);
		} 
		catch (error) {
			this.logger.error(error.message);
			return;
		}
		this.services[name] = s;
		this.parent.services[name] = s;
	}
}

//---------------------------------------------------------------------
class Service {
	constructor (name, service, logger) {
		if ('value' in service && 'build' in service) {
			throw new Error(`service '${name}' shouldn't have a 'value' and a 'build' key`);
		}
		this.name = name;
		this.service = service;
		this.logger = logger;

		this.config_deps = service.config ? utils.getParamNames(service.config) : [];
		this.build_deps = service.build ? utils.getParamNames(service.build) : [];
		this.run_deps = service.run ? utils.getParamNames(service.run) : [];

		this._value = undefined;
	}
	is_buildable () {
		return ('build' in this.service) || ('value' in this.service);
	}
	config (constants) { 
		if ('config' in this.service) {
			this.logger.info(`configuring ${this.name}`);
			let deps = this.select_deps(this.config_deps, constants);
			this.service.config(...deps); 		
		}
	}
	build (services) { 
		this.logger.info(`building ${this.name}`);
		if ('value' in this.service) {
			this._value = this.service.value;
		} else {
			let deps = this.select_deps(this.build_deps, services);
			this._value = this.service.build(...deps);
		}
	}
	run (services) { 
		if ('run' in this.service) {
			this.logger.info(`running ${this.name}`);
			let deps = this.select_deps (this.run_deps, services);
			this.service.run(...deps); 
		}
	}

	select_deps (names, obj) {
		let self = this;
		return names.map(function (name) {
			if (name === 'logger') {
				return loggerFactory.make(self.name);
			} else {
				return (obj[name] instanceof Service) ? obj[name]._value : obj[name];
			}
		});
	}
}
