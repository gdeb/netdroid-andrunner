/*jslint node: true */
'use strict';

let logger = require('../misc/logger.js'),
	home_view = require('../views/home.js');

//-----------------------------------------------------------------------------
function home (req, res, options) {
	res.render('index', options);
}

module.exports.home = {
	urls: ['/', '/index.html'],
	methods: ['get'],
	controller: home,
	access: 'public'
};

//-----------------------------------------------------------------------------
function test_home (req, res, options) {
	res.render('home', options);
}

module.exports.home = {
	urls: ['/test-home'],
	methods: ['get'],
	script: 'test.js',
	controller: test_home,
	access: 'public'
};

