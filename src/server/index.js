/*jslint node: true */
'use strict';

var express = require('express'),
    logger = require('../logger'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compression = require('compression'),
    morgan = require('morgan'),
    Mustache = require('mustache'),
    Server = require('./server.js');

//-----------------------------------------------------------------------------
const port = process.env.PORT || 8080,
	app = express(),
	server = new Server();

//-----------------------------------------------------------------------------
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', './views');

//-----------------------------------------------------------------------------
// Middlewares
app.use(morgan('short'));

app.use(function ignoreFavicon (req, res, next) {
	if (req.url === '/favicon.ico') 
		res.send(404);
	else
		next();
});

app.use(compression());
app.use(express.static('.tmp/static/', { maxAge: '99999'})); 
app.use(cookieParser('TopSecret'));
app.use(bodyParser());
app.use(session());

app.use(function restrictAccess(req, res, next) {
	if (req.url === '/' || req.url === '/login' || req.session.user) 
		return next();
	req.session.error = "Access denied";
	res.redirect('login');
});

//-----------------------------------------------------------------------------
function render_view(res, view, session) {
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


//-----------------------------------------------------------------------------
// Routes
//-----------------------------------------------------------------------------
app.get('/', function(req, res) {
	render_view(res, 'index', req.session);
});

app.get('/login', function (req, res) {
	render_view(res, 'login', req.session);
});

app.post('/login', function (req, res) {
	if (req.body.username === 'gery' || req.body.password === 'gery') {
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

app.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/');
});

app.get('/lobby', function (req, res) {
	render_view(res, 'lobby', req.session);
});


app.listen(port);

logger.info('server started on port ' + port);

