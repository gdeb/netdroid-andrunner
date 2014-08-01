/*jslint node: true */
'use strict';

angular.module('chat').factory('websocket', function () {
	let socket = new WebSocket('ws://0.0.0.0:8081');

	return {
		send: msg => socket.send(JSON.stringify(msg))
	}
});

