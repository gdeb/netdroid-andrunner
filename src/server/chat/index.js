/*jslint node: true */
'use strict';

let app = require('../../moebius');

app.create_module('chat', []);

require('./chatService.js');
