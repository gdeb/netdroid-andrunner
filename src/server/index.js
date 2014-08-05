/*jslint node: true */
'use strict';


let loader = require('./loader.js');

let modules = [
	'config',
	'db',
	'users',
	'security',
	// 'http_server',
	// 'websocket_server',
];

let netdroid = loader(modules, {
	db: { 
		adapter: 'nedb',
	},
	logger: { 
		type: 'console', 
		log_level: 'debug',
		db: 'debug',
	},
});

// netdroid.http_server.start();
// netdroid.websocket_server.start();




// modules
// let config = require('./config'),
// 	db = require('./db'),
// 	users = require('./users'),
// 	security = require('./security');
	// http_server = require('./http_server'),
	// ws_server = require('./websocket_server');

// logger
// let Logger = require('./logger')({
// 	type: 'console',
// 	log_level: 'debug',
// });

// init phase
// config.init(new Logger('config'));
// db.init(new Logger('db'), config);
// users.init(new Logger('users'), db, config);
// security.init(0, Logger({module: 'Security'}), config, users)
// http_server.init(config, security, Logger);
// ws_server.init(config, Logger);
// security.init(1,http_server);

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


// {
// 	config: [],
// 	// db: ['config'],
// 	// users: ['config', 'db'],
// 	// security: [['config', 'users'], ['http_server']],
// 	// http_server: ['config', 'security'],
// 	// websocket_server: ['config'], 
// };

