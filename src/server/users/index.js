/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.create_module('user', []);

require('./permissionService');
require('./modelService');

