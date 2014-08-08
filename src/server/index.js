/*jslint node: true */
'use strict';

let modules = [
	'config',
	'db',
	'users',
	'security',
	'http_server',
	'websocket_server',
	'chat',
];

let config = (process.env.NODE_ENV === 'production') 
		? require('./production.json')
		: require('./development.json');


if (require.main === module) {
	// running standalone
	let loader = require('./loader.js'),
		netdroid = loader(modules, config);

	netdroid.http_server.start();
	netdroid.websocket_server.start();

} else {
	// is required by another script (most likely repl)
	module.exports = {
		config: config,
		modules: modules
	};
}



