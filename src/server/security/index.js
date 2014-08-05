/*jslint node: true */
'use strict';

module.exports = function (logger) {

	let access_control = {
		dependencies: ['users', 'config'],
		init (users, config) {
			// to do
			logger.info('initialization complete (access control)');
		},
	};

	let authentication = {
		dependencies: ['users', 'http_server'],
		init (users, http_server) {
			// to do
			logger.info('initialization complete (authentication)');
		}
	};

	return [access_control, authentication];
};