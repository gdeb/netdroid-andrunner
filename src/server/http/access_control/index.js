/*jslint node: true */
'use strict';

module.exports = function access_control (logger) {
	return {
		depends: ['users.model', 'users.permission'],
		start (...deps) {
			return require('./security.js')(logger, ...deps);
		},
	};
};
