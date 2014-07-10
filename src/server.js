/*jslint node: true */
'use strict';

let fs = require('fs'),
	express = require('express'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression');

let WebSocketServer = require('ws').Server,
	logger = require('./framework/logger.js');

const VIEWS = "./resources/templates/",
	  SECRET = 'Go NetDroid!',
	  HTTP_PORT = process.argv[2] || 8080,
	  WS_PORT = process.argv[3] || 8081,
	  session_store = new session.MemoryStore(),
	  cookie_parser = cookieParser(SECRET),
	  ws_routes = [];

//-----------------------------------------------------------------------------
// configure express
var app = express();
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', VIEWS);

// configure middlewares
app.use(ignore_url('/favicon.ico'));
app.use(http_logger(logger));
app.use(compression());
app.use('/vendor', express.static('./node_modules/angular/lib/', { maxAge: '99999'})); 
app.use('/vendor', express.static('./node_modules/bootstrap/dist/', { maxAge: '99999'})); 
app.use('/vendor', express.static('./node_modules/jquery/dist/', { maxAge: '99999'})); 
app.use(express.static('./_build/public', { maxAge: '99999'})); 
app.use(cookie_parser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
	store:session_store,
	resave: true,
	saveUninitialized: true,
	secret: SECRET,
}));

// load all schemas
fs
	.readdirSync("./_build/src/schemas/")
	.forEach(file => require('./schemas/' + file).init('./_build/db'));

// load all routes
fs
	.readdirSync("./_build/src/routes/")
	.forEach(file => load_routes(require('./routes/' + file)));

// start http server
app.listen(HTTP_PORT);
logger.info("http server started on port " + HTTP_PORT + ".");

// start websocket server
let websocket_server = new WebSocketServer({port: WS_PORT});
websocket_server.on('connection', socket => handle_ws_connection(socket));
logger.info("WebSocket Server started on port " + WS_PORT + ".");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------
function handle_ws_connection (socket) {
	cookie_parser(socket.upgradeReq, null, function (err) {
		var session_id = socket.upgradeReq.signedCookies['connect.sid'];
		session_store.get(session_id, function (err, session) {
			session.websocket = socket;
			socket.on('message', msg => handle_ws_message(msg, session));
		});
	});
}

function handle_ws_message (msg, session) {
	let json_msg = JSON.parse(msg);
	logger.info('Received message on ws');
	for (let route of ws_routes) {
		if (route.dispatch(json_msg))
			route.controller(json_msg, session);
	}
}

function load_routes(routes) {
	for (let name of Object.keys(routes)) {
		let route = routes[name];
		if (route.websocket)
			ws_routes.push(route);
		else
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
		let options = {
			error: req.session.error,
			info: req.session.info,
			success: req.session.success,
			user: req.session.user,
			script: route.script,
			partials: {
				header: 'header',
				navbar: 'navbar',
				footer: 'footer',
			},
		};
		delete req.session.error;
		delete req.session.info;
		delete req.session.success;
		route.controller(req, res, options);
	};		
}

//-----------------------------------------------------------------------------
// Custom Middlewares
//-----------------------------------------------------------------------------
function ignore_url (...urls) {
	return (req,res,next) => urls.indexOf(req.url)>-1 ? res.send(404) : next();
}

function http_logger(logger) {
	return function (req, res, next) {
		const start = process.hrtime();

	   	function logRequest(){
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
	    res.once('finish', logRequest);
		next();
	};
}

