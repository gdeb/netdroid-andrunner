/*jslint node: true */
'use strict';

module.exports = function (logger) {
	return {
		depends: ['users', 'users.permission'],
		link (...deps) {
			return require('./security.js')(logger, ...deps);
		},
	};
};
