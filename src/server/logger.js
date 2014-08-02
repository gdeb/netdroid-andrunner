/*jslint node: true */
'use strict';

require('colors');
let utils = require('../common/utils.js');

//-----------------------------------------------------------------------------
function log(type, color, ...args) {
    args.unshift(utils.getTimeStamp(), type[color]);
    console.log(...args);
}

let normal_logger = {
    info: function (...args) { log('- info  -', 'green', ...args); },
    warn: function (...args) { log('- warn  -', 'yellow', ...args); },
    error: function (...args) { log('- error -', 'red', ...args); },
    debug: function (...args) { log(' [DEBUG] ', 'cyan', ...args); },
};

let trivial_logger = {
    info: function () {},
    warn: function () {},
    error: function () {},
    debug: function () {},
};

module.exports = function (type) {
    if (type === 'trivial')
        return trivial_logger;
    if (type === 'normal')
        return normal_logger;
};