/*jslint node: true */
'use strict';

// Module db

let extend = require('node.extend');

module.exports = function (logger) {
	return {
		dependencies: ['config'],

		init (...deps) {
			logger.debug('initializing');
		    extend(this, require('./nedb.js')(logger, ...deps));
		    logger.info('initialization complete');
		}
	};
};

