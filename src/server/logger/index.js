/*jslint node: true */
'use strict';

// Module Logger
module.exports = function (options) {
	let logger = require(`./${options.type}Logger.js`);

	return {
		make: make_logger,
	};

	function make_logger (name) {
		let log_level = options[name] || options.log_level;
		return {
			debug: function (...args) {
				if (log_level === 'debug')
					logger.debug(name, ...args);
			},
			info: function (...args) {
				if (log_level === 'debug' || log_level === 'info')
					logger.info(name, ...args);
			},
			warn: function (...args) {
				if (log_level !== 'error') 
					logger.warn(name, ...args);
			},
			error: function (...args) {
				logger.error(name, ...args);
			}
		};
	}
};

