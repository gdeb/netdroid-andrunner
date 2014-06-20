/*jslint node: true */
'use strict';

let express = require('express'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
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
		app.use(adapt_logger(this.logger));
		app.use(ignoreFavicon);
		app.use(compression());
		app.use(express.static(this.paths.static, { maxAge: '99999'})); 
		app.use(cookieParser('TopSecret'));
		app.use(bodyParser());
		app.use(session());
		app.use(restrictAccess);

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

