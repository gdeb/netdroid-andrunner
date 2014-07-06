/*jslint node: true */
'use strict';

let Datastore = require('nedb'),
	logger = require('../framework/logger.js');

//-----------------------------------------------------------------------------
let db;

let	initial_users = [
	{username: "gery", password: "gery"},
	{username: "g", password: "g"},
	{username: "demo", password: "pw"},
];

//-----------------------------------------------------------------------------
function initialize(folder) {
	db = new Datastore({filename: folder + '/users.db', autoload: true});
	for (let user of initial_users) {
		add_user(user);
	}
}

function validate_user (user) {
	return true;
}

function add_user (user) {
	if (validate_user(user)) 
		db.insert(user);
	else
		throw new Error('Invalid user');
}

function find_user (name, password, callback) {
	db.find({
		username: name, 
		password: password
	}, callback);
}

function update_password (name, old_pw, new_pw, cb) {
	logger.debug('update_password');
	let user_info = {
		username: name,
		password: old_pw,
	};
	db.find(user_info, function (err, users) {
		logger.debug('dbfind', users);
		if (users.length) {
			db.update(user_info, {$set: {password: new_pw}}, function (err) {
				return cb(null, "success");
			});
		} else {
			cb('wrong password');
		}
	});

}

//-----------------------------------------------------------------------------
module.exports = {
	init: initialize,
	add: add_user,
	find: find_user,
	update_password: update_password,
};
