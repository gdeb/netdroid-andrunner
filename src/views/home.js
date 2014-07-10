/*jslint node: true */
'use strict';

let Mustache = require('mustache'),
	fs = require('fs'),
	logger = require('../framework/logger.js');

let TEMPLATES = './_build/templates/';

module.exports.home = function (options) {
	// fs.readFile(TEMPLATES + 'index.html', function (err, file) {
	// 	logger.debug(file.toString());
	// });
	return Mustache.render('index.html');
};
