/*jslint node: true */
'use strict';

let injector = require('../../injector');

let db = injector.module('db', []);

require('./adapterService.js');
