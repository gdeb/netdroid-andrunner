/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('chat', []);

require('./chatService.js');
