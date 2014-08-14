/*jslint node: true */
'use strict';

module.exports = function (logger, ws_server) {
	ws_server.add_route({url:'/sendchat', controller: send_chat});

	return {};

	function send_chat(msg, session) {
		logger.info(`Chat message from ${session.user}: ${JSON.stringify(msg)}`);
		ws_server.broadcast({
			url: '/new_msg',
			from: session.user
		});
	}
};

