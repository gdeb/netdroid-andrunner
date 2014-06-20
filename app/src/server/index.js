/*jslint node: true */
'use strict';

let Server = require('./server.js'),
	port = process.env.PORT || 8080,
	logger = require('../logger');

// console.log(__dirname);

let paths = require(process.env.CONFIG_FOLDER + 'paths.json').build;
// console.log(process.argv);
// console.log(process.env.CONFIG_FOLDER);
//-----------------------------------------------------------------------------
new Server(port, paths, {logger:logger});

