/*jslint node: true */
'use strict';

let repl = require("repl"),
	loader = require("./loader.js"),
	netdroid = require('./index.js');

console.log('Welcome to Netdroid REPL');
console.log('Type "load()" to start');
let replServer = repl.start({
	prompt: "netdroid > ",
});

replServer.context.config = netdroid.config;
replServer.context.modules = netdroid.modules;
replServer.context.load = function () {
	replServer.context.app = loader(netdroid.modules, netdroid.config);
	console.log('The application is available in the "app" variable');
};