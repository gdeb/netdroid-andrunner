/*jslint node: true */
'use strict';

module.exports = function (logger, ws_server) {
	ws_server.add_route({url:'/sendchat', controller: send_chat});

	ws_server.on('user:connection', notify_new_user);
	ws_server.on('user:disconnection', notify_disconnect);

	return {};

	function send_chat(msg, session) {
		logger.info(`Chat message from ${session.user}: ${JSON.stringify(msg)}`);
		ws_server.broadcast({
			url: '/new_msg',
			from: session.user,
			msg: msg.msg,
		});
	}

	function notify_new_user (user) {
		logger.debug(`User ${user} joined the chat room.`);
		ws_server.broadcast({
			url: '/chat/new_user',
			name: user
		});		
	}

	function notify_disconnect (user) {
		logger.debug(`User ${user} left the chat room.`);
		ws_server.broadcast({
			url: '/chat/user_left',
			name: user
		});		
	}
};

