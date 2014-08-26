/*jslint node: true */
'use strict';

require('autostrip-json-comments');

let node_env = process.env.NODE_ENV,
	env = node_env === 'production' ? 'production' : 'development',
	settings = require(`./${env}.json`),
	injector = require('../injector');

//---------------------------------------------------------------------

let modules = [
	'db',
	// 'users',
	// 'http',
	// 'websocket',
	// 'chat',
];

injector.config(settings);
injector.module('netdroid', modules);

for (let name of modules) {
	require('./' + name);
}


//---------------------------------------------------------------------
if (require.main === module) { 
	injector.start('netdroid');
} 


// let modules = ['db', 'users', 'http', 'websocket'];

// for (let name of modules) {
// 	let mod = require('./' + name);
// 	netdroid.add_module(mod);
// }



// let loader = require('./loader.js'),
// 	env = process.env.NODE_ENV,
// 	config_file = `./${env==='production' ? 'production' : 'development'}.json`,
// 	project_config = require(config_file),
// 	netdroid = loader(project_config);

// if (require.main === module) { // standalone
// 	netdroid.load();
// 	netdroid.link();
// 	netdroid.run();
// } else {
// 	module.exports = netdroid;
// }



// let db = require('./db');
