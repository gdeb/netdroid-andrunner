/*jslint node: true */
'use strict';

require('colors');
let utils = require('../common/utils.js');

//-----------------------------------------------------------------------------
function log(type, color, module_name, ...args) {
    args.unshift(utils.getTimeStamp(), type[color], `[${module_name}]`);
    console.log(...args);
}

module.exports = {
    debug: function (...args) { log('- debug -', 'cyan', ...args); },
    info: function (...args) { log('- info  -', 'green', ...args); },
    warn: function (...args) { log('- warn  -', 'yellow', ...args); },
    error: function (...args) { log('- error -', 'red', ...args); },
};

