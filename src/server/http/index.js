/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.create_module('http', []);

require('./sessionService');
require('./accessControlService');
require('./serverService');
require('./authenticationService');
