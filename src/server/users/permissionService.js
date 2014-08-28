/*jslint node: true */
'use strict';

let app = require('../../moebius');

let user = app.module('user');

user.service('permission', {
	value: require('../../common/permission.json'),
});
