/*jslint node: true */
'use strict';

// Module Config

let session = require('express-session'),
    cookieParser = require('cookie-parser'),
	auth = require('../../common/authentication.js');

module.exports = function (logger) {
	let secret_key = 'Go Netdroid';

	let settings = {
		http_port: process.argv[2] || 8080,
		ws_port: process.argv[3] || 8081,
		user_roles: auth.user_roles,
		access_levels: auth.access_levels,
		secret_key: secret_key,
		session_store: new session.MemoryStore(),
		cookie_parser: cookieParser(secret_key),
		build_folder: './_build',
	};

	return {
		init () {},
		get (key) {
			if (key in settings)
				return settings[key];
			logger.error(`(config) Key ${key} not in config store.`);
		}
	};
};
