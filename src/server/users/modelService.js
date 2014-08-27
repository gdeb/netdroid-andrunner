/*jslint node: true */
'use strict';

let injector = require('../../injector');

let user = injector.module('user');

user.service('user_model', {
	build: user_model
});

function user_model (logger, db_adapter, permission) {
	return {
		add (user) {
			logger.debug(`adding ${JSON.stringify(user)} to users`);
			db_adapter.insert('users', user);
		},
		find (name, password, callback) {
			db_adapter.find('users', {
				username: name, 
				password: password
			}, callback);
		},
		update_password (name, old_pw, new_pw, cb) {
			let user_info = {
				username: name,
				password: old_pw,
			};
			db_adapter.find('users', user_info, function (err, users) {
				if (users.length) {
					db_adapter.update('users', user_info, {$set: {password: new_pw}}, function (err) {
						return cb(null, "success");
					});
				} else {
					cb('wrong password');
				}
			});
		},
	};
};