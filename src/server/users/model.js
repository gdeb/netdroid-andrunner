/*jslint node: true */
'use strict';

module.exports = function (db) {
	return {
		init () {
			let created = db.load('users');
			if (created) {
				for (let user of require('./data.json')) {
					this.add(user);
				}				
			}
		},
		add (user) {
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