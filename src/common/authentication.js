/*jslint node: true */
'use strict';

const ROLES = {
    public: 1,
    user: 2,
    admin: 4,
};

const ACCESS_LEVELS = {
	public: ROLES.public | ROLES.user | ROLES.admin,
    anon: ROLES.public,
    user: ROLES.user | ROLES.admin,
    admin: ROLES.admin,
};

module.exports = {
	user_roles: ROLES,
	access_levels: ACCESS_LEVELS,
};