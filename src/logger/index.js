/*jslint node: true */
'use strict';

require('colors');

//-----------------------------------------------------------------------------
function pad(x) {
    return String(x).length === 1 ? "0" + x : String(x);
}

function getTimeStamp() {
    var now = new Date(),
        hours = pad(now.getHours()),
        minutes = pad(now.getMinutes()),
        seconds = pad(now.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
}

//-----------------------------------------------------------------------------
var silent = false,
    colored = true;

function log(type, color, arg) {
    if (silent) return;
    var logged_type = (colored) ? type[color] : type;
    console.log(getTimeStamp(), logged_type, arg);
}

module.exports = {
    info: function (arg) { log('- info  -', 'green', arg);},
    warn: function (arg) { log('- warn  -', 'yellow', arg);},
    error: function (arg) { log('- error -', 'red', arg);},
    debug: function (arg) { log(' [DEBUG] ', 'cyan', arg);},

    config: function (options) {
        if (options.hasOwnProperty('silent'))
            silent =  options.silent;
        if (options.hasOwnProperty('color'))
            colored = options.color;
    }
};
