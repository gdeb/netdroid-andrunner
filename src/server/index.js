/*jslint node: true */
'use strict';

var express = require('express'),
    logger = require('../logger'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    morgan = require('morgan'),
    Mustache = require('mustache');


var port = process.env.PORT || 8080;

var app = express();

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', './views');


app.use(morgan('short'));
app.use(express.static('.tmp/', { maxAge: '99999'})); 
app.use(cookieParser('TopSecret'));
app.use(bodyParser());
app.use(session());

function restrict (req, res, next) {
	if (!req.session.user) {
		req.session.error = "Access denied";
		res.redirect('login');
	} else {
		next();
	}
}

function get_partials() {
    return {
        header: 'header',
        footer: 'footer',
        navbar: 'navbar',    
    };
};

app.get('/', function(req, res) {
    res.render('index', {
    	error: req.session.error,
        login: true,
        partials: get_partials()
    });
});

app.get('/login', function (req, res) {
	var error = req.session.error;
	logger.debug(error);
	delete req.session.error;
    res.render('login', {
    	error: error,
        partials: get_partials()
    });
});

app.post('/login', function (req, res) {
	if (req.body.username === 'gery' || req.body.password === 'gery') {
		req.session.regenerate(function () {
			req.session.user = 'gery';
			res.redirect('lobby');
		});
	} else {
		req.session.error = "Login failed.  Try again.";
		res.redirect('login');
	}
});

app.get('/lobby', restrict, function (req, res) {
    res.render('lobby', {
    	error: req.session.error,
        partials: get_partials()
    });
});


app.listen(port);

logger.info('server started on port ' + port);

