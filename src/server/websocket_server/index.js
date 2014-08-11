/*jslint node: true */
'use strict';

module.exports = function (logger, options) {
	return {
		depends: ['http_server.session'],
		link(...deps) {
			return require('./server.js')(logger, ...deps);
		},
		run (server) {
			server.start(options.port);
		},
	};
};
