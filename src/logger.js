/*jslint node: true */
'use strict';

require('colors');
let dateformat = require('dateformat');

function getTimeStamp() {
    return dateformat(new Date(), 'HH:MM:ss');
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
