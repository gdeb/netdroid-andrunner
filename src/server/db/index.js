/*jslint node: true */
'use strict';

let app = require('../../moebius');

let db = app.module('db', []);

require('./dbService.js');
