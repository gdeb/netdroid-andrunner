/*jslint node: true */
'use strict';

// Module db

let extend = require('node.extend');

module.exports = function (logger, options) {
	return {
		dependencies: ['config'],
		init (...deps) {
			let adapter = require('./' + options.adapter + '.js');
		    extend(this, adapter(logger, ...deps));
		    logger.info('initialization complete');
		},
	};
};

