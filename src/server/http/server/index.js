/*jslint node: true */
'use strict';

module.exports = function server (logger) {
	return {
		depends: ['http.session', 'http.access_control'],
		start (...deps) {
			return require('./server.js')(logger, ...deps);
		},
	};
};

