/*jslint node: true */
'use strict';

var express = require('express'),
    logger = require('../logger'),
    consolidate = require('consolidate'),
    Mustache = require('mustache');


var port = process.env.PORT || 8080;

var app = express();

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', './views');


app.use(express.static('.tmp/')); 

function get_partials() {
    return {
        header: 'header',
        footer: 'footer',
        navbar: 'navbar',    
    };
};

app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.get('/index.html', function (req, res) {
    res.render('index', {
        login: true,
        partials: get_partials()
    });
});

app.get('/login.html', function (req, res) {
    res.render('login', {
        locals: {},
        partials: get_partials()
    });
});


app.listen(port);

logger.info('server started on port ' + port);

