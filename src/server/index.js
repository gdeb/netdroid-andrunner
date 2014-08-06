/*jslint node: true */
'use strict';

let loader = require('./loader.js');

let modules = [
	'config',
	'db',
	'users',
	'security',
	'http_server',
	'websocket_server',
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

netdroid.http_server.start();
netdroid.websocket_server.start();



