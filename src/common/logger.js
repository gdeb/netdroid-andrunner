/*jslint node: true */
'use strict';

require('colors');

let pad = (x) => String(x).length === 1 ? "0" + x : String(x);

function getTimeStamp() {
    let now = new Date(),
        hours = pad(now.getHours()),
        minutes = pad(now.getMinutes()),
        seconds = pad(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
    info: function (...args) {
        args.unshift(getTimeStamp(), '- info  - '.green);
        console.log(...args);
    },
    warn: function (...args) {
        args.unshift(getTimeStamp(), '- warn  - '.yellow);
        console.log(...args);
    },
    error: function (...args) {
        args.unshift(getTimeStamp(), '- error - '.red);
        console.log(...args);
    },
    debug: function (...args) {
        args.unshift('[DEBUG] '.cyan);
        console.log(...args);
    },
};
