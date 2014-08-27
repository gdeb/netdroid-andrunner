/*jslint node: true */
'use strict';

let injector = require('../../injector'),
	express_session = require('express-session'),
	cookieParser = require('cookie-parser');

let http = injector.module('http');

http.service('session', {
	config (session_secret) {
		this.secret = session_secret;
	},
	build () {
		let cookie_parser = cookieParser(this.secret),
			session_store = new express_session.MemoryStore();

		let options = {
			store: session_store,
			resave: true,
			saveUninitialized: true,
			secret: this.secret,
		};

		let user_session = express_session(options);

		return {
			secret: this.secret,
			cookie_parser: cookie_parser,
			session_store: session_store,
			user_session: user_session,
		};
	}
});
