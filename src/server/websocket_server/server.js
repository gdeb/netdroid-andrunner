/*jslint node: true */
'use strict';

let WebSocketServer = require('ws').Server,
	EventEmitter = require('events').EventEmitter;

module.exports = function (logger) {

	return class extends EventEmitter {
		constructor (session) {
			this._routes = {};
			this._session_store = session.session_store;
			this._cookie_parser = session.cookie_parser;
			this._server = null;
			this._users = {};
		}

		start(port) {
			this._server = new WebSocketServer({port: port});
			this._server.on('connection', socket => this.handle_connection(socket));
			logger.info("Server started on port " + port + ".");
		}

		add_route (route) {
			if (!('url' in route) || !('controller' in route)) {
				logger.error('Attempt to add invalid route:', JSON.stringify(route));
			} else {
				logger.debug('adding route', route.url);
				this._routes[route.url] = route.controller;
			}
		}

		broadcast (msg) {
			logger.debug(`Broadcasting message ${JSON.stringify(msg)}`);
			for (let client of this._server.clients) {
				client.send(JSON.stringify(msg));
			}
		}

		send (user, msg) {
			if (!(user in this._users)) {
				logger.warn(`Trying to send message to ${user}, but she/he is not connected.`);
				return;
			}
			logger.debug(`Sending ${msg} to ${user}`);
			this._users[user].send(JSON.stringify(msg));
		}

		handle_connection (socket) {
			let self = this;
			this._cookie_parser(socket.upgradeReq, null, function (err) {
				let session_id = socket.upgradeReq.signedCookies['connect.sid'];
				self._session_store.get(session_id, function (err, session) {
					self.add_new_connection(socket, session);
				});
			});	
		}

		add_new_connection (socket, session) {
			if ('user' in session) {
				logger.info(`New connection from user ${session.user}`);
				this._users[session.user] = socket;
				this.emit('new_connection', session.user);
				socket.on('message', msg => this.dispatch(msg, session));
				socket.on('close', function () {
					logger.info(`${session.user} disconnected`);	
					delete this._users[session.user];
				});
			} else {
				logger.info('Connection attempt from unlogged user. Connection closed');
				socket.close();
			}
		}

		dispatch (msg, session) {
			logger.info(`Received message from ${session.user} : ${msg}`);
			var json_msg;
			try {
				json_msg = JSON.parse(msg);
			} 
			catch (e) {
				logger.error('Invalid message (should be a JSON parsable string)');
				return;
			}
			if (json_msg.url in this._routes) {
				this._routes[json_msg.url](json_msg, session);
			} else {
				logger.warn(`No valid route for message ${msg}`);
			}
		}
	};
};
