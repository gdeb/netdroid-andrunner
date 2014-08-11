/*jslint node: true */
'use strict';

let session = require('express-session'),
   cookieParser = require('cookie-parser');

module.exports = function (logger, options = {}) {
	if (!('secret' in options)) {
		logger.warn('No secret key set for session management');
	}
	let secret = options.secret || 'test key',
		cookie_parser = cookieParser(secret),
		session_store = new session.MemoryStore();

	let session_options = {
		store: session_store,
		resave: true,
		saveUninitialized: true,
		secret: secret,
	};
	let user_session = session(session_options);

	return {
		link () {
			return {
				secret: secret,
				cookie_parser: cookie_parser,
				session_store: session_store,
				user_session: user_session,
			};
		},
	};
};

