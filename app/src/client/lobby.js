/*jslint node: true */
'use strict';

let socket_url = `ws://${window.location.hostname}:8081`;

let web_socket = new WebSocket(socket_url);
web_socket.onopen = function () {
	web_socket.send('hello frow web_socket');
};
