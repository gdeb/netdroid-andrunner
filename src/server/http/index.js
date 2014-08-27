/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('http', []);

require('./sessionService');
require('./accessControlService');
require('./serverService');
require('./authenticationService');
