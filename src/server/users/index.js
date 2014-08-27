/*jslint node: true */
'use strict';

let injector = require('../../injector');

injector.module('user', []);

require('./permissionService.js');
require('./modelService.js');


// Module users

// module.exports = function users (logger) {
// 	return {
// 		values: [require('./permission')],
// 		services: [require('./model')],

// 		depends: ['db.adapter', 'users.permission', 'users.model'],
// 		start (db, permission, users) {			
// 			let created = db.load('users');
// 			if (created) {
// 				let roles = permission.user_roles;
// 				for (let user of require('./data.json')) {
// 					user.role = roles[user.role];
// 					users.add(user);
// 				}				
// 			}
// 		}
// 	};
// };

