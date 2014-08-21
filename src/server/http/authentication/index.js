/*jslint node: true */
'use strict';

module.exports = function authentication (logger) {
	return {
		depends: ['users.model', 'http.server'],
		start(...deps) {
			require('./routes.js')(logger, ...deps);
		}
	};
};

