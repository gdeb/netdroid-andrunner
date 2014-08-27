/*jslint node: true */
'use strict';

let injector = require('../../injector');

let user = injector.module('user');

user.service('permission', {
	value: require('../../common/permission.json'),
});
