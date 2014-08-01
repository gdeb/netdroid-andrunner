/*jslint node: true */
'use strict';

var server = require('./http_server.js'),
	logger = require('./logger.js');

let settings = {
	HTTP_PORT: process.argv[2] || 8080,
	  WS_PORT: process.argv[3] || 8081,
	  SECRET: 'Go NetDroid!',
};

server(settings, logger);