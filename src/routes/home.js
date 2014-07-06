/*jslint node: true */
'use strict';

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

