/*jslint node: true */
'use strict';


console.log('lobby');

let socket_url = `ws://${window.location.hostname}:8081`;

let web_socket = new WebSocket(socket_url);
web_socket.onopen = function () {
	let msg = JSON.stringify({type:'register_chat'});
	console.log(msg);
	web_socket.send(msg);
};

web_socket.onmessage = function (msg) {
	console.log('msg received', msg);
};