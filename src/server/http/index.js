/*jslint node: true */
'use strict';

module.exports = function http (logger, options) {	
	return {
		depends: ['http.server'],
		start (server) {
			server.start(options.port);
		},

		values: [require('./session')],
		services: [
			require('./access_control'), 
			require('./server'),
			require('./authentication'),
		],
	};
};

