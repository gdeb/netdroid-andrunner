/*jslint node: true */
'use strict';

module.exports = function (logger, options) {
	return {
		depends: ['http_server.session', 'http_server.access_control'],
		submodules: ['access_control', 'session'],
		link (...deps) {
			return require('./server.js')(logger, ...deps);
		},
		run (server) {
			server.start(options.port);
		}
	};
};
