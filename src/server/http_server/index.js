/*jslint node: true */
'use strict';

let extend = require('node.extend');

// module.e
module.exports = function (logger) {
	return {
		dependencies: ['config', 'security.access_control'],
		init(...deps) {
			// extend(this, require('./server.js')(...deps));
		},
	}
};
