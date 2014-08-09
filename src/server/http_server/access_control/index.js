/*jslint node: true */
'use strict';

module.exports = function (logger) {
	// let permission = require('../../../common/permission.json');
	return {
		link () {
			return {};
			// return permission;
		},
	};
};



// 	let access_control = {
// 		name: 'access_control',
// 		dependencies: ['users', 'config'],
// 		init (...deps) {
// 			extend(this, require('./access_control.js')(logger, ...deps));
// 		},
// 	};
