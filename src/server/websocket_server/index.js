/*jslint node: true */
'use strict';


module.exports = function (logger, options) {

	let Server = require('./server.js')(logger);

	return {
		depends: ['http_server.session'],
		link(...deps) {
			return new Server(...deps);
		},
		run (server) {
			server.start(options.port);
		},
	};
};
