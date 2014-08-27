/*jslint node: true */
'use strict';

require('autostrip-json-comments');
let _ = require('lodash');

let node_env = process.env.NODE_ENV,
	env = node_env === 'production' ? 'production' : 'development',
	settings = require(`./${env}.json`),
	injector = require('../injector');

//---------------------------------------------------------------------
let modules = [
	'db',
	'users',
	'http',
	'websocket',
	'chat',
];

injector.config(settings);
injector.module('netdroid', modules);

_.each(settings.settings, (value, name) => injector.constant(name, value));

for (let name of modules) {
	require('./' + name);
}

//---------------------------------------------------------------------
if (require.main === module) { 
	injector.start('netdroid');
} else {
	module.exports = netdroid;
}

