/*jslint node: true */
'use strict';

let str = JSON.stringify;

module.exports = function (logger, db) {
	return {
		add (user) {
			logger.debug(`adding ${str(user)} to users`);
			db.insert('users', user);
		},
		find (name, password, callback) {
			db.find('users', {
				username: name, 
				password: password
			}, callback);
		},
		update_password (name, old_pw, new_pw, cb) {
			let user_info = {
				username: name,
				password: old_pw,
			};
			db.find('users', user_info, function (err, users) {
				if (users.length) {
					db.update('users', user_info, {$set: {password: new_pw}}, function (err) {
						return cb(null, "success");
					});
				} else {
					cb('wrong password');
				}
			});
		},
	};
};