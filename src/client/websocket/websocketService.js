/*jslint node: true */
'use strict';

angular.module('websocket').factory('wsService', function ($rootScope, authService, AUTH_EVENTS) {
	let ws,
		routes = {};


	if (authService.is_logged_in())
		open_connection();
	else {
		$rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
			open_connection();
		});
	}

	return {
		add_route: add_route,
		send: send,
	};

	function open_connection () {
		ws = new WebSocket('ws://0.0.0.0:8081');
		ws.addEventListener('message', function (msg) {
			dispatch_msg(JSON.parse(msg.data));
		});
	}

	function add_route (route) {
		if (!('url' in route) || !('controller' in route)) {
			console.error('Invalid route:', route);
			return;
		} 
		routes[route.url] = route;
	}

	function send (url, msg) {
		if (!ws) {
			console.error('Attempt to use websocket before it is ready');
			return;
		}
		ws.send(JSON.stringify({
			url: url,
			msg: msg,
		}));
	}

	function dispatch_msg(msg) {
		if (msg.url in routes) {
			routes[msg.url].controller(msg);
		} else {
			console.log('warning: unhandled message', msg);
		}
	}
});

