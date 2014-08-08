/*jslint node: true */
'use strict';

let extend = require('node.extend');

module.exports = function (logger, options) {
	return {
		dependencies: ['config'],
		init(...deps) {
			extend(this, require('./server.js')(logger, ...deps));
		},
		port: options.port
	};
};
