/*jslint node: true */
'use strict';

let utils = require('../common/utils.js');

const LEVELS_STR = {
	debug: '- debug -',
	info: '- info  -',
	warn: '- warn  -',
	error: '- error -',
};
const COL_LEVELS_STR = {
	debug: '\x1B[36m- debug -\x1B[39m',
	info: '\x1B[32m- info  -\x1B[39m',
	warn: '\x1B[33m- warn  -\x1B[39m',
	error: '\x1B[31m- error -\x1B[39m',
};
const LEVELS = {
	'debug': 0,
	'info': 1,
	'warn': 2,
	'error': 3,
};

let type, log_level, logger, settings;
//---------------------------------------------------------------------

module.exports = {
	config (options) {
		type = options.type || type;
		log_level = options.log_level || log_level;
		logger = consoleLogger(options);
		settings = options;
	},
	make (name, level = log_level) {
		level = (name in settings) ? settings[name] : log_level;
		function log (actual_level, ...args) {
			if (LEVELS[level] <= LEVELS[actual_level])
				logger[actual_level](name, ...args);
		}
		return {
			debug: (...args) => log('debug', ...args),
			info: (...args) => log('info', ...args),
			warn: (...args) => log('warn', ...args),
			error: (...args) => log('error', ...args),
		};
	},
};



//---------------------------------------------------------------------
function console_log (type, module_name, ...args) {
	let timestamp = utils.getTimeStamp();
    console.log(timestamp, type, `[${module_name}]`, ...args);
}

function consoleLogger (options = {}) {
	let levels = options.colored ? COL_LEVELS_STR : LEVELS_STR;
	return {
	    debug (...args) { console_log(levels.debug, ...args); },
	    info (...args) { console_log(levels.info, ...args); },
	    warn (...args) { console_log(levels.warn, ...args); },
	    error (...args) { console_log(levels.error, ...args); },
	};
}
