/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('user', []);

require('./permissionService');
require('./modelService');

