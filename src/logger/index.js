/*jslint node: true */
'use strict';

const LEVELS = {
	'debug': 0,
	'info': 1,
	'warn': 2,
	'error': 3,
};

module.exports = function (options) {
	let type = options.type,
		log_level = options.log_level;

	let logger = require('./consoleLogger.js')(options);

	return function (name, level = log_level) {
		return {
			debug: (...args) => log('debug', ...args),
			info: (...args) => log('info', ...args),
			warn: (...args) => log('warn', ...args),
			error: (...args) => log('error', ...args),
		};

		function log (actual_level, ...args) {
			if (LEVELS[level] <= LEVELS[actual_level])
				logger[actual_level](name, ...args);
		}
	}
}

