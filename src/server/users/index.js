/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.module('user', []);

require('./permissionService');
require('./modelService');

