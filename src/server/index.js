/*jslint node: true */
'use strict';

let loader = require('./loader.js');

let modules = [
	'db',
	'users',
	'http_server',
	'authentication',
	'websocket_server',
	// 'chat',
];

let settings = (process.env.NODE_ENV === 'production') 
		? require('./production.json')
		: require('./development.json');

let netdroid = loader(settings);

if (require.main === module) {
	// running standalone
	netdroid.load();
	netdroid.link();
	netdroid.run();

} else {
	module.exports = netdroid;
}



