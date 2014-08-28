/*jslint node: true */
'use strict';

let app = require('../../moebius'),
	WebSocketServer = require('ws').Server,
	EventEmitter = require('events').EventEmitter;

let websocket = app.module('websocket');

websocket.service('ws_server', {
	config (ws_port) {
		this.port = ws_port;
	},
	build (session, logger) {
		return new WS_Server(session, logger);
	},
	run (ws_server) {
		ws_server.start(this.port);
	}
});

class WS_Server extends EventEmitter {
	constructor (session, logger) {
		this._routes = {};
		this._session_store = session.session_store;
		this._cookie_parser = session.cookie_parser;
		this._server = null;
		this._users = {};
		this.logger = logger;
	}

	start(port) {
		this._server = new WebSocketServer({port: port});
		this._server.on('connection', socket => this.handle_connection(socket));
		this.logger.info("Server started on port " + port + ".");
	}

	add_route (route) {
		if (!('url' in route) || !('controller' in route)) {
			this.logger.error('Attempt to add invalid route:', JSON.stringify(route));
		} else {
			this.logger.debug('adding route', route.url);
			this._routes[route.url] = route.controller;
		}
	}

	broadcast (msg) {
		this.logger.debug(`Broadcasting message ${JSON.stringify(msg)}`);
		for (let client of this._server.clients) {
			client.send(JSON.stringify(msg));
		}
	}

	send (user, msg) {
		if (!(user in this._users)) {
			this.logger.warn(`Trying to send message to ${user}, but she/he is not connected.`);
			return;
		}
		this.logger.debug(`Sending ${msg} to ${user}`);
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
		let self = this;
		if ('user' in session) {
			this.logger.info(`New connection from user ${session.user}`);
			this._users[session.user] = socket;
			this.emit('user:connection', session.user);
			socket.on('message', msg => this.dispatch(msg, session));
			socket.on('close', function () {
				self.logger.info(`${session.user} disconnected`);
				self.emit('user:disconnection', session.user);
				delete self._users[session.user];
			});
		} else {
			this.logger.info('Connection attempt from unlogged user. Connection closed');
			socket.close();
		}
	}

	dispatch (msg, session) {
		this.logger.info(`Received message from ${session.user} : ${msg}`);
		var json_msg;
		try {
			json_msg = JSON.parse(msg);
		} 
		catch (e) {
			this.logger.error('Invalid message (should be a JSON parsable string)');
			return;
		}
		if (json_msg.url in this._routes) {
			this._routes[json_msg.url](json_msg, session);
		} else {
			this.logger.warn(`No valid route for message ${msg}`);
		}
	}
};
