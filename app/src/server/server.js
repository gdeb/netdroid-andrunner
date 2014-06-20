/*jslint node: true */
'use strict';

let express = require('express'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
	Datastore = require('nedb'),
	users_db = new Datastore({filename:'_build/db/users.db', autoload:true}),
    compression = require('compression');

//-----------------------------------------------------------------------------
class Server {
	constructor (port, paths, options = {})  {
		this.logger = options.logger || require('../logger');
		this.paths = paths;

		let app = express();
		
		this.config_express(app);
		this.config_middlewares(app);
		this.config_routes(app);

		app.listen(port);
		this.logger.info(`Server started on port ${port}.`);
	}

	config_express (app) {
		app.engine('html', consolidate.mustache);
		app.set('view engine', 'html');
		app.set('views', this.paths.views);
	}

	config_middlewares (app) {
		app.use(adapt_logger(this.logger));
		app.use(ignoreFavicon);
		app.use(compression());
		app.use(express.static(this.paths.static, { maxAge: '99999'})); 
		app.use(cookieParser('TopSecret'));
		app.use(bodyParser());
		app.use(session());
		app.use(restrictAccess);
	}

	config_routes (app) {
		app.get('/', (req, res) => this.render_view(res, 'index', req.session));
		app.get('/login', (req, res) => this.render_view(res, 'login', req.session));
		app.get('/lobby', (req, res) => this.render_view(res, 'lobby', req.session));
		app.get('/profile', (req, res) => this.render_view(res, 'profile', req.session));

		app.post('/login', function (req, res) {
			users_db.find({
				username: req.body.username, 
				password: req.body.password
			}, function (err, users) {
				if (users.length) {
					req.session.regenerate(function () {
						req.session.user = 'gery';
						req.session.success = 'Success';
						res.redirect('lobby');
					});
				} else {
					req.session.error = "Login failed.  Try again.";
					res.redirect('login');
				}
			});
		});

		app.get('/logout', function (req, res) {
			req.session.destroy();
			res.redirect('/');
		});
	}

	render_view (res, view, session) {
		res.render(view, {
			error: session.error,
			success: session.success,
			user: session.user,
			partials: {
				header: 'header',
				navbar: 'navbar',
				footer: 'footer',
			},
		});
		delete session.error;
		delete session.success;
	}
}

module.exports = Server;

//-----------------------------------------------------------------------------
// Custom Middlewares
//-----------------------------------------------------------------------------
function ignoreFavicon (req, res, next) {
	if (req.url === '/favicon.ico') 
		res.send(404);
	else
		next();
}

function restrictAccess(req, res, next) {
	if (req.url === '/' || req.url === '/login' || req.session.user) 
		return next();
	req.session.error = "Access denied";
	res.redirect('login');
}

function adapt_logger(logger) {
	return function (req, res, next) {
		const start = process.hrtime();

	   	function logRequest(){
	      	res.removeListener('finish', logRequest);
	      	let diff = process.hrtime(start),
	      		request_time = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3),
	      		http = req.httpVersionMajor + '.' + req.httpVersionMinor,
	      		url = req.originalUrl || req.url,
	      		code = res.statusCode,
	      		status = (code === 404) ? String(code).red : code;

	      	logger.info([
	      		req.ip,
	      		`${req.method} ${req.url} (HTTP/${http})`,
	      		`status: ${status}`,
	      		`${request_time} ms`,
	      	].join(', '));
	    }
	    res.on('finish', logRequest);
		next();
	};
}

