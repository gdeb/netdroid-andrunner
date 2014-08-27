/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('websocket', []);

require('./ws_serverService.js');
