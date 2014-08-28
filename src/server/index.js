/*jslint node: true */
'use strict';

require('autostrip-json-comments');
let _ = require('lodash');

let node_env = process.env.NODE_ENV,
	env = node_env === 'production' ? 'production' : 'development',
	settings = require(`./${env}.json`),
	app = require('../moebius')(settings.logger);

//---------------------------------------------------------------------
let modules = [
	'db',
	'users',
	'http',
	'websocket',
	'chat',
];

app.create_module('netdroid', modules);

_.each(settings.settings, (value, name) => app.create_constant(name, value));

for (let name of modules) {
	require('./' + name);
}

//---------------------------------------------------------------------
if (require.main === module) { 
	app.start('netdroid');
} else {
	module.exports = app;
}

