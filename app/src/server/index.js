/*jslint node: true */
'use strict';

let Server = require('./server.js'),
	config_folder = process.env.CONFIG_FOLDER,
	logger = require('../logger'),
	paths = require(config_folder + 'paths.json').build,
	routes = require(config_folder + 'routes.json'),
	settings = require(config_folder + 'settings.json'),
	controllers = require('../controllers');

//-----------------------------------------------------------------------------
new Server({
	port: process.env.PORT || 8080, 
	paths: paths,
	routes: routes,
	logger: logger,
	controllers: controllers,
	settings: settings,
});

