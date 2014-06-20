/*jslint node: true */
'use strict';

require('colors');

//-----------------------------------------------------------------------------
let pad = (x) => String(x).length === 1 ? "0" + x : String(x);

function getTimeStamp() {
    let now = new Date(),
        hours = pad(now.getHours()),
        minutes = pad(now.getMinutes()),
        seconds = pad(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

//-----------------------------------------------------------------------------
let silent = false,
    colored = true;

function log(type, color, ...args) {
    if (silent) return;
    let logged_type = (colored) ? type[color] : type;
    args.unshift(getTimeStamp(), logged_type);
    console.log(...args);
}

module.exports = {
    info: function (...args) { log('- info  -', 'green', ...args); },
    warn: function (...args) { log('- warn  -', 'yellow', ...args); },
    error: function (...args) { log('- error -', 'red', ...args); },
    debug: function (...args) { log(' [DEBUG] ', 'cyan', ...args); },

    config: function (options) {
        if (options.hasOwnProperty('silent'))
            silent =  options.silent;
        if (options.hasOwnProperty('color'))
            colored = options.color;
    }
};
