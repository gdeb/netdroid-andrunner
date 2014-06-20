/*jslint node: true */
'use strict';

let Server = require('./server.js'),
	logger = require('../logger');

let	port = process.env.PORT || 8080,
	paths = require(process.env.CONFIG_FOLDER + 'paths.json').build;

//-----------------------------------------------------------------------------
new Server(port, paths, {logger:logger});

