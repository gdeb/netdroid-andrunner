/*jslint node: true */
'use strict';

//-----------------------------------------------------------------------------

let __id_counter = 0;

module.exports.uniqueId = function () {
    return __id_counter++;
};
