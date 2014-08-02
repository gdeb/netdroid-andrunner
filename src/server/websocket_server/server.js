/*jslint node: true */
'use strict';

let WebSocketServer = require('ws').Server;

module.exports = function (WS_PORT, session_store, cookie_parser, logger) {
	let ws_routes = [];

	let websocket_server = new WebSocketServer({port: WS_PORT});
	websocket_server.on('connection', socket => handle_ws_connection(socket));
	logger.info("WebSocket Server started on port " + WS_PORT + ".");

	// load_routes(require('../routes/chat.js'));


	function load_routes(routes) {
		for (let name of Object.keys(routes)) {
			let route = routes[name];
			if (route.websocket)
				ws_routes.push(route);
		}
	}

	function handle_ws_connection (socket) {
		cookie_parser(socket.upgradeReq, null, function (err) {
			var session_id = socket.upgradeReq.signedCookies['connect.sid'];
			session_store.get(session_id, function (err, session) {
				session.websocket = socket;
				socket.on('message', msg => handle_ws_message(msg, session));
			});
		});	
	}

	function handle_ws_message (msg, session) {
		logger.debug(msg);
		logger.debug(msg.route);
		let json_msg = JSON.parse(msg);
		logger.info('Received message on ws');
		for (let route of ws_routes) {
			if (json_msg.route === route.url) {
				route.controller(json_msg, session);
			}
		}
	}
}