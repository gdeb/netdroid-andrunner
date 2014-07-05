/*jslint node: true */
'use strict';

let Datastore = require('nedb');

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

//-----------------------------------------------------------------------------
module.exports = {
	init: initialize,
	add: add_user,
	find: find_user,
};
