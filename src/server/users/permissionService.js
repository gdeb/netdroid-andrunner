/*jslint node: true */
'use strict';

let injector = require('../../injector');


injector.module('user').service('permission', {
	value: require('../../../common/permission.json')
});
