/*jslint node: true */
'use strict';

let injector = require('../../injector'),
	express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression');

let middlewares = require('./middlewares');

let http = injector.module('http');

http.service('server', {
	config (http_port) {
		this.port = http_port;
	},
	build (logger, session, accessControl) {
		return server(logger, session, accessControl);
	},
	run (server) {
		server.start(this.port);
	}
});

function server (logger, session, access_control) {
	let app = express();

	let server_info = require('./server_info.json');

	let server = {
		start (port) {
			this.server = app.listen(port);
			logger.info(`Server started on port ${port}.`);
		},
		add_route (route) {
			if (!('url' in route) || 
				!('method' in route) || 
				!('controller' in route))
				throw new Error('Invalid route:');
			logger.debug(`adding ${route.method.toUpperCase()} route: ${route.url}`);
			access_control.secure_route(route);
			app[route.method](route.url, route.controller);
		},
		stop () {
			this.server.close();
			logger.info('http server stopped.');
		}
	};

	// configure middlewares
	app.use(middlewares.ignore_url('/favicon.ico'));
	app.use(middlewares.http_logger(logger));
	app.use(compression());

	for (let route of server_info.static_files) {
		app.use(route.url, express.static(route.path, { maxAge: '99999'}));
	}

	app.use(session.cookie_parser);
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(session.user_session);
	app.use(access_control.check_credentials);

	// add default routes
	for (let route of server_info.entry_points) {
		route.controller = (req, res) => res.sendfile('_build/html/main.html');
		route.method = "get";
		route.entry_point = true;
		server.add_route(route);
	}

	return server;
};
