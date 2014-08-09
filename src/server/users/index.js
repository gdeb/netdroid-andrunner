/*jslint node: true */
'use strict';

// Module users

module.exports = function (logger) {
	return {
		dependencies: ['db', 'users.permission'],
		submodules: ['permission'],

		link (...deps) {
			return require('./model.js')(logger, ...deps);
		},

		run (users) {
			users.add_initial_users();
		}
	};
};


