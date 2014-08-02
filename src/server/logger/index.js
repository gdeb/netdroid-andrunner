/*jslint node: true */
'use strict';

module.exports = function (type) {
    if (type === 'trivial')
        return require('./trivialLogger.js');
    if (type === 'normal')
        return require('./consoleLogger.js');    
};
