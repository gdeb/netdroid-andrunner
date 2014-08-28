/*jslint node: true */
'use strict';

let utils = require('./utils');

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
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

//---------------------------------------------------------------------
module.exports = {
	config ({type, log_level}) {
		this.type = type;
		this.log_level = log_level;
	},
	make (name, level = this.log_level) {
		return new ConsoleLogger (name, level);
	},
};

//---------------------------------------------------------------------
class Logger {
	constructor (name, log_level) {
		this.name = name;
		this.log_level = LEVELS[log_level];
	}
	log (log_level, ...args) {
		if (LEVELS[log_level] >= this.log_level) {
			this._log(log_level, ...args);
		}
	}
	_log (log_level, ...args) {}

	debug (...args) { this.log('debug', ...args); }
	info (...args) { this.log('info', ...args); }
	warn (...args) { this.log('warn', ...args); }
	error (...args) { this.log('error', ...args); }
}

class ConsoleLogger extends Logger {
	_log (log_level, ...args) {
		let levels = COL_LEVELS_STR,
			timestamp = utils.getTimeStamp();
		console.log(timestamp, levels[log_level], `[${this.name}]`, ...args);
	}
}

