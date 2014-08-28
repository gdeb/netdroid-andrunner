/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.module('http', []);

require('./sessionService');
require('./accessControlService');
require('./serverService');
require('./authenticationService');
