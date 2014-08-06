/*jslint node: true */
'use strict';

let WebSocketServer = require('ws').Server;

module.exports = function (logger, config) {
	let routes = {},
		session_store = config.get('session_store'),
		cookie_parser = config.get('cookie_parser'),
		port = config.get('ws_port');

	return {
		start() {
			let websocket_server = new WebSocketServer({port: port});
			websocket_server.on('connection', socket => handle_connection(socket));
			logger.info("WebSocket Server started on port " + port + ".");
		},
		add_route (route) {
			if (!('url' in route) || !('controller' in route))
				throw new Error('Invalid route:');
			routes[route.url] = route.controller;
		},
	};

	function handle_connection (socket) {
		cookie_parser(socket.upgradeReq, null, function (err) {
			var session_id = socket.upgradeReq.signedCookies['connect.sid'];
			session_store.get(session_id, function (err, session) {
				session.websocket = socket;
				socket.on('message', msg => dispatch(msg, session));
			});
		});	
	}

	function dispatch (msg, session) {
		logger.debug(msg);
		logger.debug(msg.route);
		let json_msg = JSON.parse(msg);
		logger.info('Received message on ws');
		if (json_msg.route in routes) {
			routes[json_msg.route](json_msg, session);
		} else {
			logger.warn(`Message ${msg} was not dispatched to a controller`);
		}
	}

};