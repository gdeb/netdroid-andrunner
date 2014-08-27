/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('http', []);

require('./sessionService.js');
require('./accessControlService.js');
require('./serverService.js');
require('./authenticationService.js');
