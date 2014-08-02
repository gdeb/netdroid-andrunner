/*jslint node: true */
'use strict';

let logger = require('../logger')('normal'),
	folder = './_build/db';

module.exports = require('./nedb.js')(folder, logger);