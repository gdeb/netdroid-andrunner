/*jslint node: true */
'use strict';

let extend = require('node.extend');

module.exports = {
	init(...deps) {
		extend(this, require('./server.js')(...deps));
	}
};