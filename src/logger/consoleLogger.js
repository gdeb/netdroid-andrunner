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

function log (type, module_name, ...args) {
	let timestamp = utils.getTimeStamp();
    console.log(timestamp, type, `[${module_name}]`, ...args);
}

module.exports = function (options = {}) {
	let levels = options.colored ? COL_LEVELS_STR : LEVELS_STR;
	return {
	    debug (...args) { log(levels.debug, ...args); },
	    info (...args) { log(levels.info, ...args); },
	    warn (...args) { log(levels.warn, ...args); },
	    error (...args) { log(levels.error, ...args); },
	};
};
