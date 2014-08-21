/*jslint node: true */
'use strict';


// Loading project configuration into injector
//---------------------------------------------------------------------
require('autostrip-json-comments');

let node_env = process.env.NODE_ENV,
	env = node_env === 'production' ? 'production' : 'development',
	project_config = require(`./${env}.json`),
	netdroid = require('../injector')(project_config);


// Loading project modules 
//---------------------------------------------------------------------
let modules = ['db', 'users', 'http', 'websocket'];

for (let name of modules) {
	let mod = require('./' + name);
	netdroid.add_module(mod);
}


// Starting/Exporting the application (depends if running standalone)
//---------------------------------------------------------------------
if (require.main === module) { 
	netdroid.start();
 	// console.log(require('util').inspect(netdroid, true, 10)); // 10 levels deep
 	// console.log(netdroid);
} else {
	module.exports = netdroid;
}




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
