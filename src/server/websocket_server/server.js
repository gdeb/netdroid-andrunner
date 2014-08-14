/*jslint node: true */
'use strict';

let WebSocketServer = require('ws').Server;

module.exports = function (logger, session) {
	let routes = {},
		session_store = session.session_store,
		cookie_parser = session.cookie_parser,
		websocket_server;

	return {
		start(port) {
			websocket_server = new WebSocketServer({port: port});
			websocket_server.on('connection', socket => handle_connection(socket));
			logger.info("Server started on port " + port + ".");
		},
		add_route (route) {
			if (!('url' in route) || !('controller' in route)) {
				logger.error('Attempt to add invalid route:', JSON.stringify(route));
			} else {
				routes[route.url] = route.controller;
				logger.debug('adding route', route.url);
			}
		},
		broadcast (msg) {
			logger.debug(`Broadcasting message ${JSON.stringify(msg)}`);
			for (let client of websocket_server.clients) {
				client.send(msg);
			}
		}
	};

	function handle_connection (socket) {
		cookie_parser(socket.upgradeReq, null, function (err) {
			var session_id = socket.upgradeReq.signedCookies['connect.sid'];
			session_store.get(session_id, function (err, session) {
				if ('user' in session) {
					logger.info(`New connection from user ${session.user}`);
					session.websocket = socket;
					socket.on('message', msg => dispatch(msg, session));
				} else {
					logger.info('Connection attempt from unlogged user. Connection closed');
					socket.close();
				}
			});
		});	
	}

	function dispatch (msg, session) {
		logger.info(`Received message from ${session.user} : ${msg}`);
		var json_msg;
		try {
			json_msg = JSON.parse(msg);
		} 
		catch (e) {
			logger.error('Invalid message (should be a JSON parsable string)');
			return;
		}
		if (json_msg.url in routes) {
			routes[json_msg.route](json_msg, session);
		} else {
			logger.warn(`No valid route for message ${msg}`);
		}
	}

};