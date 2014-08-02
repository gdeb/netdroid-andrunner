/*jslint node: true */
'use strict';

let middlewares = require('./middlewares.js'),
	http_server = require('./server.js');

module.exports = function (settings, session_store, cookie_parser, logger) {
	return http_server(settings, session_store, cookie_parser, logger, middlewares);
};
