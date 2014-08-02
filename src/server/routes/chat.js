/*jslint node: true */
'use strict';

// let logger = require('../logger.js');

function chat_test (msg, session) {
	console.log('chat_test');
	// logger.debug('MSG', msg);
	// res.send({logout: 'success'});
}

module.exports.chat_test = {
	websocket: true,
	url: '/test',
	controller: chat_test,
	access: 'public',
};
