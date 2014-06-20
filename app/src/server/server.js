/*jslint node: true */
'use strict';

let express = require('express'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    middlewares = require('./middlewares.js'),
    compression = require('compression');

//-----------------------------------------------------------------------------
class Server {
	constructor (config)  {
		this.port = config.port;
		this.logger = config.logger || require('../logger');
		this.paths = config.paths;

		// configure express
		let app = express();		
		app.engine('html', consolidate.mustache);
		app.set('view engine', 'html');
		app.set('views', this.paths.views);

		// configure middlewares
		app.use(middlewares.adapt_logger(this.logger));
		app.use(middlewares.ignore_url('/favicon.ico'));
		app.use(compression());
		app.use(express.static(this.paths.static, { maxAge: '99999'})); 
		app.use(cookieParser('TopSecret'));
		app.use(bodyParser());
		app.use(session());
		app.use(middlewares.restrictAccess);

		// configure routes
		for (let route of config.routes) {
			app[route.method](route.path, config.controllers[route.controller]);
		}

		// start server
		app.listen(this.port);
		this.logger.info(`Server started on port ${this.port}.`);
	}
}

module.exports = Server;
