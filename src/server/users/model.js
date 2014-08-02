/*jslint node: true */
'use strict';

let	initial_users = [
	{username: "gery", password: "gery"},
	{username: "g", password: "g"},
	{username: "demo", password: "pw"},
];

module.exports = function (db) {
	var Users = {};

	Users.init = function () {
		let created = db.load('users');
		if (created) {
			for (let user of initial_users) {
				Users.add(user);
			}				
		}
	};

	Users.add = function (user) {
		db.insert('users', user);
	};

	Users.find = function (name, password, callback) {
		db.find('users', {
			username: name, 
			password: password
		}, callback);
	};

	Users.update_password = function (name, old_pw, new_pw, cb) {
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
	};

	return Users;

};