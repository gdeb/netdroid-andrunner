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
		let port = config.port,
			logger = config.logger || require('../logger'),
			paths = config.paths,
			routes = config.routes,
			controllers = config.controllers,
			settings = config.settings;

		// configure express
		let app = express();		
		app.engine('html', consolidate.mustache);
		app.set('view engine', 'html');
		app.set('views', paths.views);

		// configure middlewares
		app.use(middlewares.http_logger(logger));
		app.use(middlewares.ignore_url('/favicon.ico'));
		app.use(compression());
		app.use(express.static(paths.static, { maxAge: '99999'})); 
		app.use(cookieParser(settings.cookie_secret));
		app.use(bodyParser());
		app.use(session());
		app.use(middlewares.restrict(routes, function (req, res) {
			req.session.error = "Access denied";
			res.redirect('login');
		}));

		// configure routes
		for (let route of routes) {
			app[route.method](route.path, controllers[route.controller]);
		}

		// start server
		app.listen(port);
		logger.info(`Server started on port ${port}.`);
	}
}

module.exports = Server;
