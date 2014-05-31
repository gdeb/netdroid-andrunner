/*jslint node: true */
'use strict';

let id_counter = 0;

module.exports.uniqueId = () => id_counter++;
