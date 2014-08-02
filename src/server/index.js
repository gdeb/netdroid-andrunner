/*jslint node: true */
'use strict';

let fs = require('fs'),
    session = require('express-session'),
    cookieParser = require('cookie-parser');

let http_server = require('./http_server'),
	ws_server = require('./websocket_server'),
	logger = require('./logger')('normal'),
	db = require('./db'),
	Users = require('./users')(db);

let SECRET = "Go Netdroid";

let settings = {
	HTTP_PORT: process.argv[2] || 8080,
	WS_PORT: process.argv[3] || 8081,
	SECRET: SECRET,
};

let	session_store = new session.MemoryStore(),
	cookie_parser = cookieParser(SECRET);

Users.init();


let server = http_server(settings, session_store, cookie_parser, logger);

require('./authentication')(Users, server);

server.start();
ws_server(settings.WS_PORT, session_store, cookie_parser, logger);