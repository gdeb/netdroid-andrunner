/*jslint node: true */
'use strict';

module.exports = function (modules_name, config) {

	let Logger = require('./logger')(config.logger);

	function load_module (name) {
		return require('./' + name)(new Logger(name));
	}
	let modules = modules_name.map(load_module);

	for (let m of modules) {
		console.log(m.dependencies);
		m.init();
	}
	// let modules = {};

	// require all modules
	// sort them by dependencies
	console.log('henyi');
	return modules;
};

