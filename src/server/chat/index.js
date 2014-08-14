/*jslint node: true */
'use strict';

// Module db

module.exports = function (logger) {
	return {
		depends: ['websocket_server'],
		link (...deps) {
			return require('./chat.js')(logger, ...deps);
		},
	};
};

