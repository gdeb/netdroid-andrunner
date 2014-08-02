/*jslint node: true */
'use strict';

let fs = require('fs'),
	express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression');

module.exports = function (
	settings, 
	session_store, 
	cookie_parser, 
	logger,
	middlewares,
	routes
) {
	var app = express();

	// configure middlewares
	app.use(middlewares.ignore_url('/favicon.ico'));
	app.use(middlewares.http_logger(logger));
	app.use(compression());
	app.use('/vendor', express.static('./node_modules/angular/lib/', { maxAge: '99999'})); 
	app.use('/vendor', express.static('./node_modules/angular-route/', { maxAge: '99999'})); 
	app.use('/vendor', express.static('./node_modules/angular-cookies/src/', { maxAge: '99999'})); 
	app.use('/vendor', express.static('./node_modules/bootstrap/dist/', { maxAge: '99999'})); 
	app.use('/vendor', express.static('./node_modules/jquery/dist/', { maxAge: '99999'})); 
	app.use('/templates', express.static('./_build/html/', { maxAge: '99999'})); 
	app.use('/fonts', express.static('./node_modules/font-awesome/fonts', {maxAge: '99999'}));
	app.use(cookie_parser);
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));
	app.use(session({
		store:session_store,
		resave: true,
		saveUninitialized: true,
		secret: settings.SECRET,
	}));

		// load all schemas
	fs
		.readdirSync("./_build/server/schemas/")
		.forEach(file => require('../schemas/' + file).init('./_build/db'));

	// load all routes
	load_routes(require('../routes/auth.js'));

	app.get('/app.js', function (req, res) {
		res.sendfile('_build/app.js');
	});

	app.get('/css/font-awesome.min.css', function (req, res) {
		res.sendfile('node_modules/font-awesome/css/font-awesome.min.css');
	});

	app.get('/netdroid.css', function (req, res) {
		res.sendfile('_build/netdroid.css');
	});

	app.get('*', function (req, res){
		let role = req.session.user ? 2 : 1;
		let username = req.session.user ? req.session.user : '';
	    res.cookie('user', JSON.stringify({
	        'username': username,
	        'role': role
	    }));
		res.sendfile('_build/html/main.html');
	});

	// start http server
	app.listen(settings.HTTP_PORT);
	logger.info("http server started on port " + settings.HTTP_PORT + ".");


	//-----------------------------------------------------------------------------
	// Helpers
	//-----------------------------------------------------------------------------

	function load_routes(routes) {
		for (let name of Object.keys(routes)) {
			let route = routes[name];
			if (!route.websocket)
				add_http_route(route);
		}
	}

	function add_http_route (route) {
		if (!('urls' in route) || 
			!('methods' in route) || 
			!('controller' in route))
			throw new Error('Invalid route:');
		let controller = make_controller(route);
		for (let method of route.methods) {
			app[method](route.urls, controller);
		}
	}

	function make_controller(route) {
		return function (req, res) {
			if (route.access !== 'public' && !req.session.user) {
				req.session.error = 'Access denied.  Please log in.';
				return res.redirect('/');
			}
			route.controller(req, res);
		};		
	}
};