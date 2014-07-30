/*jslint node: true */
'use strict';

angular.module('chat').factory('chatFactory', function () {
	let chat = {
		is_visible: false,
	};

	chat.toggle = () => chat.is_visible = !chat.is_visible;
	chat.hide = () => chat.is_visible = false;
	chat.show = () => chat.is_visible = true;
    return chat;
});

