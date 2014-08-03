/*jslint node: true */
'use strict';

// Module Logger

let extend = require('node.extend');

module.exports = {
	init (type, log_level = 'normal') {
		let logger;
		if (type === 'console') 
			logger = require('./consoleLogger.js');
	    if (type === 'trivial')
	        logger = require('./trivialLogger.js');
	    extend(this, with_log_level(logger, log_level));
	    logger.warn('Module Logger initialized');
	}
};

function with_log_level (logger, log_level) {
	return {
		debug: function (...args) {
			if (log_level === 'debug')
				logger.debug(...args);
		},
		info: function (...args) {
			if (log_level === 'debug' || log_level === 'info')
				logger.info(...args);
		},
		warn: function (...args) {
			if (log_level !== 'error') 
				logger.warn(...args);
		},
		error: function (...args) {
			logger.error(...args);
		}
	};
}
