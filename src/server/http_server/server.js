// /*jslint node: true */
// 'use strict';

// let express = require('express'),
//     bodyParser = require('body-parser'),
//     session = require('express-session'),
//     compression = require('compression');

// let middlewares = require('./middlewares.js');

// module.exports = function (settings, session_store, cookie_parser, logger) {
// 	let app = express(),
// 		routes = {};

// 	// configure middlewares
// 	app.use(middlewares.ignore_url('/favicon.ico'));
// 	app.use(middlewares.http_logger(logger));
// 	app.use(compression());

// 	for (let route of require('./static.json')) {
// 		app.use(route.url, express.static(route.path, { maxAge: '99999'}));
// 	}

// 	app.use(cookie_parser);
// 	app.use(bodyParser.json());
// 	app.use(bodyParser.urlencoded({extended: true}));
// 	app.use(session({
// 		store:session_store,
// 		resave: true,
// 		saveUninitialized: true,
// 		secret: settings.SECRET,
// 	}));

// 	// routes
// 	let routes = {
// 		'get': {
// 			'/app.js': (req, res) => res.sendfile('_build/app.js'),
// 			'/netdroid.css': (req, res) => res.sendfile('_build/netdroid.css'),
// 		},
// 		'post': {}
// 	};

// 	function add_routes () {
// 		for (let route in routes.get) {
// 			logger.debug(route);
// 			app.get(route, routes.get[route]);
// 		}
// 		for (let route in routes.post) {
// 			logger.debug(route);
// 			app.get(route, routes.post[route]);
// 		}
// 	}
// 	// app.get('/app.js', function (req, res) {
// 	// 	res.sendfile('_build/app.js');
// 	// });

// 	// app.get('/netdroid.css', function (req, res) {
// 	// 	res.sendfile('_build/netdroid.css');
// 	// });

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

// 	return {
// 		start () {
// 			add_routes();
// 			// app.get('*', fallback);
// 			this.server = app.listen(settings.HTTP_PORT);
// 			logger.info(`http server started on port ${settings.HTTP_PORT}.`);
// 		},
// 		add_middleware (...middleware) {
// 			app.use(...middleware);
// 		},
// 		add_route (route) {
// 			if (!('url' in route) || 
// 				!('method' in route) || 
// 				!('controller' in route))
// 				throw new Error('Invalid route:');
// 			for (let method of route.methods) {
// 				app[method](route.urls, make_controller(route));
// 			}			
// 		},
// 		stop () {
// 			this.server.close();
// 			logger.info('http server stopped.');
// 		}
// 	};
// };
