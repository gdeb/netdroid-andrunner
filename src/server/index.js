/*jslint node: true */
'use strict';

// modules
let logger = require('./logger');
	// config = require('./config'),
	// db = require('./db'),
	// users = require('./users'),
	// security = require('./security'),
	// http_server = require('./http_server'),
	// ws_server = require('./websocket_server');

// init phase
logger.init('console', 'warn');
// config.init(logger);
// db.init(config);
// users.init(db, logger);
// security.init(config, users, logger)
// http_server.init(config, security, logger);
// ws_server.init(config, logger);

// prepare phase
// security.prepare(http_server);

// start phase
// http_server.start();
// ws_server.start();


// let session = require('express-session'),
//     cookieParser = require('cookie-parser');
	// roles = require('../common/authentication.js').user_roles,
	// access_levels = require('../common/authentication.js').access_levels,
	// access_control = require('./security').access_control,
	// authentication = require('./security').authentication;


// let settings = {
// 	HTTP_PORT: process.argv[2] || 8080,
// 	WS_PORT: process.argv[3] || 8081,
// 	SECRET: "Go Netdroid",
// };

// let	session_store = new session.MemoryStore(),
// 	cookie_parser = cookieParser(SECRET);



// require('./authentication')(Users, server);


// http_server.start();
// ws.start();