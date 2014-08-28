/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.create_module('db', []);

require('./dbService.js');
