/*jslint node: true */
'use strict';

module.exports = function server (logger) {
	let Server = require('./server.js')(logger);

	return {
		depends: ['http.session'],
		start (session) {
			return new Server(session);
		},
	};
};

