/*jslint node: true */
'use strict';

module.exports = function (logger, options) {
	return {
		dependencies: ['http_server.session', 'http_server.access_control'],
		submodules: ['access_control', 'session'],
		init(...deps) {
			return {};
			// extend(this, require('./server.js')(logger, ...deps));
		},
		// port: options.port
	};
};
