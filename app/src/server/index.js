/*jslint node: true */
'use strict';

let	config_folder = process.env.CONFIG_FOLDER,
	paths = require(config_folder + 'paths.json').build,
	routes = require(config_folder + 'routes.json'),
	settings = require(config_folder + 'settings.json'),
	make_server = require('./server.js');

//-----------------------------------------------------------------------------
make_server({
	settings: settings,
	routes: routes,
	paths: paths,
});
