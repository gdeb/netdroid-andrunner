/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('user', []);

require('./permissionService.js');
require('./modelService.js');

