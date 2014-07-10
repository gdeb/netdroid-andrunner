/*jslint node: true */
'use strict';

let logger = require('../framework/logger.js'),
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

