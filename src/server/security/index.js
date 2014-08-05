/*jslint node: true */
'use strict';

let extend = require('node.extend');

module.exports = function (logger) {

	let access_control = {
		name: 'access_control',
		dependencies: ['users', 'config'],
		init (...deps) {
			extend(this, require('./access_control.js')(logger, ...deps));
		},
	};

	let authentication = {
		name: 'authentication',
		dependencies: ['users', 'http_server'],
		init (users, http_server) {
			// to do
		}
	};
	return [access_control, authentication];
};

