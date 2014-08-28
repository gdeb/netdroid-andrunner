/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.create_module('websocket', []);

require('./ws_serverService');
