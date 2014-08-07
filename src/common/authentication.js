/*jslint node: true */
'use strict';

let roles = {
	public: 1,
	user: 2,
	admin: 4,
};

let access_levels = {
	public: roles.public | roles.user | roles.admin,
	anon : roles.public,
	user: roles.user | roles.admin,
	admin: roles.admin,
};

let roles_descr = {};
roles_descr[roles.public] = "public";
roles_descr[roles.user] = "user";
roles_descr[roles.admin] = "admin";


let access_levels_descr = {};
access_levels_descr[access_levels.public] = "public";
access_levels_descr[access_levels.anon] = "anon";
access_levels_descr[access_levels.user] = "user";
access_levels_descr[access_levels.admin] = "admin";

module.exports = {
	user_roles: roles,
	roles_description: roles_descr,
	access_levels: access_levels,
	access_levels_description: access_levels_descr,
};

