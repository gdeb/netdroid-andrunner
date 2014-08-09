/*jslint node: true */
'use strict';

// Module Logger
module.exports = function (options) {
	let logger = require(`./${options.type}Logger.js`);

	return {
		make: make_logger,
	};

	function make_logger (module_name, log_level = options.log_level) {
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
};

