/*jslint node: true */
'use strict';

let app = require('../../moebius');

let user = app.module('user');

user.service('Users', {
	build: user_model,
	run (DB, permission, Users) {
		let created = DB.load('users');
		if (created) {
			let roles = permission.user_roles;
			for (let user of require('./data.json')) {
				user.role = roles[user.role];
				Users.add(user);
			}				
		}
	}
});

function user_model (logger, DB, permission) {
	return {
		add (user) {
			logger.debug(`adding ${JSON.stringify(user)} to users`);
			DB.insert('users', user);
		},
		find (name, password, callback) {
			DB.find('users', {
				username: name, 
				password: password
			}, callback);
		},
		update_password (name, old_pw, new_pw, cb) {
			let user_info = {
				username: name,
				password: old_pw,
			};
			DB.find('users', user_info, function (err, users) {
				if (users.length) {
					DB.update('users', user_info, {$set: {password: new_pw}}, function (err) {
						return cb(null, "success");
					});
				} else {
					cb('wrong password');
				}
			});
		},
	};
};

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
