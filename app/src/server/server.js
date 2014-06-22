/*jslint node: true */
'use strict';

let express = require('express'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression');

let middlewares = require('./middlewares.js'),
    annotate_route = middlewares.annotate_route,
    http_logger = middlewares.http_logger,
    ignore_url = middlewares.ignore_url,
    restrict = middlewares.restrict;

let WebSocketServer = require('ws').Server,
	logger = require('../logger'),
	controllers = require('../controllers');

//-----------------------------------------------------------------------------	
let	session_store = new session.MemoryStore(),
	cookie_parser;

//-----------------------------------------------------------------------------
module.exports = function make_server (config) {
	let settings = config.settings,
		routes = config.routes,
		paths = config.paths;

	cookie_parser = cookieParser(settings.cookie_secret);

	// configure express
	let app = express();
	app.engine('html', consolidate.mustache);
	app.set('view engine', 'html');
	app.set('views', paths.views);

	// configure middlewares
	app.use(http_logger(logger));
	app.use(ignore_url('/favicon.ico'));
	app.use(compression());
	app.use(express.static(paths.static, { maxAge: '99999'})); 
	app.use(cookie_parser);
	app.use(bodyParser());
	app.use(session({store:session_store}));
	app.use(annotate_route(routes, (req, res) => res.redirect('/')));
	app.use(restrict((req, res) => res.redirect('/login')));

	// configure routes
	routes.map(r => app[r.method](r.path, controllers[r.controller]));

	// start http server
	app.listen(settings.http_port);
	logger.info(`Server started on port ${settings.http_port}.`);

	// start websocket server
    let websocket_server = new WebSocketServer({
    	port: settings.ws_port, 
    });
    websocket_server.on('connection', s => handle_ws_connection(s));
	logger.info(`WebSocket Server started on port ${settings.ws_port}.`);
};

function handle_ws_connection (s) {
	cookie_parser(s.upgradeReq, null, function (err) {
		let session_id = s.upgradeReq.signedCookies['connect.sid'];
		session_store.get(session_id, function (err, session) {
			s.on('message', msg => handle_ws_message(msg, session));
		});
	});
}

function handle_ws_message (msg, session) {
	// logger.info('Received message from ', session);
	// logger.debug(msg);
}
