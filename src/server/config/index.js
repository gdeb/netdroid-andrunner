/*jslint node: true */
'use strict';

// Module Config

let session = require('express-session'),
    cookieParser = require('cookie-parser'),
	auth = require('../../common/authentication.js');

module.exports = function (logger, options) {
	let settings = {
		http_port: options.http_port,
		ws_port: options.ws_port,
		user_roles: auth.user_roles,
		access_levels: auth.access_levels,
		secret_key: options.secret,
		session_store: new session.MemoryStore(),
		cookie_parser: cookieParser(options.secret),
		build_folder: options.build_folder,
	};

	return {
		init () {},
		get (key) {
			if (key in settings)
				return settings[key];
			logger.error(`Key ${key} not in config store.`);
		}
	};
};
