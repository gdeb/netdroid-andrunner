/*jslint node: true */
'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression');

let middlewares = require('./middlewares.js');

module.exports = function (logger, config, access_control) {
	let app = express();

	let server = {
		start () {
			let port = config.get('http_port');
			this.server = app.listen(port);
			logger.info(`Server started on port ${port}.`);
		},
		add_route (route) {
			if (!('url' in route) || 
				!('method' in route) || 
				!('controller' in route))
				throw new Error('Invalid route:');
			access_control.secure_route(route);
			app[route.method](route.url, route.controller);
			logger.debug(`route added: ${route.method.toUpperCase()} ${route.url}`);
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

	for (let route of require('./static.json')) {
		app.use(route.url, express.static(route.path, { maxAge: '99999'}));
	}

	app.use(config.get('cookie_parser'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(session({
		store: config.get('session_store'),
		resave: true,
		saveUninitialized: true,
		secret: config.get('secret_key'),
	}));
	app.use(access_control.check_credentials);

	// add default routes
	for (let route of require('./entry_points.json')) {
		route.controller = (req, res) => res.sendfile('_build/html/main.html');
		route.method = "get";
		route.entry_point = true;
		server.add_route(route);
	}

	return server;
};


// 	// function fallback (req, res) {
// 	// 	let role = req.session.user ? 2 : 1;
// 	// 	let username = req.session.user ? req.session.user : '';
// 	//     res.cookie('user', JSON.stringify({
// 	//         'username': username,
// 	//         'role': role
// 	//     }));
// 	// 	res.sendfile('_build/html/main.html');
// 	// }

// 	// function make_controller(route) {
// 	// 	return function (req, res) {
// 	// 		if (route.access !== 'public' && !req.session.user) {
// 	// 			req.session.error = 'Access denied.  Please log in.';
// 	// 			return res.redirect('/');
// 	// 		}
// 	// 		route.controller(req, res);
// 	// 	};		
// 	// }

