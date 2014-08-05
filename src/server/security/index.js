/*jslint node: true */
'use strict';

module.exports = function (logger) {

	let access_control = {
		name: 'access_control',
		dependencies: ['users', 'config'],
		init (users, config) {
			// to do
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