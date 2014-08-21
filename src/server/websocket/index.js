/*jslint node: true */
'use strict';


module.exports = function websocket (logger, options) {

	return {
		services: [require('./server')],
		depends: ['websocket.server'],
		start (server) {
			server.start(options.port);
		},
	};
};
