// /*jslint node: true */
// 'use strict';

// let WebSocketServer = require('ws').Server;

// 	// start websocket server
// 	let websocket_server = new WebSocketServer({port: settings.WS_PORT});
// 	websocket_server.on('connection', socket => handle_ws_connection(socket));
// 	logger.info("WebSocket Server started on port " + settings.WS_PORT + ".");

// 	function handle_ws_connection (socket) {
// 		cookie_parser(socket.upgradeReq, null, function (err) {
// 			var session_id = socket.upgradeReq.signedCookies['connect.sid'];
// 			session_store.get(session_id, function (err, session) {
// 				session.websocket = socket;
// 				socket.on('message', msg => handle_ws_message(msg, session));
// 			});
// 		});
// 	}

// 	function handle_ws_message (msg, session) {
// 		logger.debug(msg);
// 		logger.debug(msg.route);
// 		let json_msg = JSON.parse(msg);
// 		logger.info('Received message on ws');
// 		for (let route of ws_routes) {
// 			if (json_msg.route === route.url) {
// 				route.controller(json_msg, session);
// 			}
// 		}
// 	}
