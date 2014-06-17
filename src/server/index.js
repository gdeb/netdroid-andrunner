/*jslint node: true */
'use strict';

let Server = require('./server.js'),
	port = process.env.PORT || 8080,
	logger = require('../logger');

//-----------------------------------------------------------------------------
new Server(port, {logger:logger});

