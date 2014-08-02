/*jslint node: true */
'use strict';

let http_server = require('./http_server.js'),
	ws_server = require('./ws_server.js'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
	logger = require('./logger.js');

let SECRET = "Go Netdroid";

let settings = {
	HTTP_PORT: process.argv[2] || 8080,
	WS_PORT: process.argv[3] || 8081,
	SECRET: SECRET,
};

let	session_store = new session.MemoryStore(),
	cookie_parser = cookieParser(SECRET);

http_server(settings, session_store, cookie_parser, logger);
ws_server(settings.WS_PORT, session_store, cookie_parser, logger);