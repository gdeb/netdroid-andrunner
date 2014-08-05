/*jslint node: true */
'use strict';

// Module Logger

let extend = require('node.extend');

module.exports = function (options) {
	let type = options.type,
		default_log_level = options.log_level;

	return class {
		constructor (module_name, log_level = default_log_level) {
			let logger = require('./' + type + 'Logger.js');
		    extend(this, with_log_level(logger, log_level, module_name));
		}
	};
}

function with_log_level (logger, log_level, module_name) {
	return {
		debug: function (...args) {
			if (log_level === 'debug')
				logger.debug(module_name, ...args);
		},
		info: function (...args) {
			if (log_level === 'debug' || log_level === 'info')
				logger.info(module_name, ...args);
		},
		warn: function (...args) {
			if (log_level !== 'error') 
				logger.warn(module_name, ...args);
		},
		error: function (...args) {
			logger.error(module_name, ...args);
		}
	};
}
