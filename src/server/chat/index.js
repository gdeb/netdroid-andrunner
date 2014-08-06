/*jslint node: true */
'use strict';

// Module db

let extend = require('node.extend');

module.exports = function (logger) {
	return {
		dependencies: ['users', 'websocket_server'],
		init (...deps) {
			let chat = require('./chat.js');
		    extend(this, chat(logger, ...deps));
		},
	};
};

