/*jslint node: true */
'use strict';

var server = require('./http_server.js'),
    session = require('express-session'),
	logger = require('./logger.js');

let settings = {
	HTTP_PORT: process.argv[2] || 8080,
	  WS_PORT: process.argv[3] || 8081,
	  SECRET: 'Go NetDroid!',
};

let session_store = new session.MemoryStore();

server(settings, session_store, logger);