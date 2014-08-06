/*jslint node: true */
'use strict';

module.exports = function (logger, users, config) {
	let routes = {
		get: {},
		post: {},
	};
	let access_levels = config.get('access_levels');

	return {
		secure_route (route) {
			if (!('access_level' in route)) {
				route.access_level = access_levels.admin;
				logger.warn(`Missing access_level key in route ${route.url}. Set to admin.`);
			}
		},
		check_credentials(req, res, next) {
			next();
		}
	};
};

	// function  (req, res){
	// 	let role = req.session.user ? 2 : 1;
	// 	let username = req.session.user ? req.session.user : '';
	//     res.cookie('user', JSON.stringify({
	//         'username': username,
	//         'role': role
	//     }));
	// 	res.sendfile('_build/html/main.html');
	// });

	// http_server.add_fallback_route({
	// 	urls: ['*'],
	// 	methods: ['get'],
	// 	controller: 
	// });
