/*jslint node: true */
'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression');

let middlewares = require('./middlewares.js');

module.exports = function (settings, session_store, cookie_parser, logger) {
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

	app.get('/app.js', function (req, res) {
		res.sendfile('_build/app.js');
	});

	app.get('/css/font-awesome.min.css', function (req, res) {
		res.sendfile('node_modules/font-awesome/css/font-awesome.min.css');
	});

	app.get('/netdroid.css', function (req, res) {
		res.sendfile('_build/netdroid.css');
	});

	app.get('/', function (req, res){
		let role = req.session.user ? 2 : 1;
		let username = req.session.user ? req.session.user : '';
	    res.cookie('user', JSON.stringify({
	        'username': username,
	        'role': role
	    }));
		res.sendfile('_build/html/main.html');
	});

	function make_controller(route) {
		return function (req, res) {
			if (route.access !== 'public' && !req.session.user) {
				req.session.error = 'Access denied.  Please log in.';
				return res.redirect('/');
			}
			route.controller(req, res);
		};		
	}

	return {
		start () {
			app.listen(settings.HTTP_PORT);
			logger.info(`http server started on port ${settings.HTTP_PORT}.`);
		},
		add_route (route) {
			if (!('urls' in route) || 
				!('methods' in route) || 
				!('controller' in route))
				throw new Error('Invalid route:');
			for (let method of route.methods) {
				app[method](route.urls, make_controller(route));
			}			
		},
	}
};
