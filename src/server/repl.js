/*jslint node: true */
'use strict';

let repl = require("repl"),
	netdroid = require('./index.js');

console.log('Welcome to Netdroid REPL');
console.log('Type "netdroid.load().link().run()" to start');
let replServer = repl.start({
	prompt: "netdroid > ",
});

replServer.context.netdroid = netdroid;
// replServer.context.modules = netdroid.modules;
// replServer.context.load = function () {
// 	replServer.context.app = loader(netdroid.modules, netdroid.config);
// 	console.log('The application is available in the "app" variable');
// };