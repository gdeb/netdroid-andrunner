/*jslint node: true */
'use strict';

angular.module('chat').factory('chatFactory', function (authService) {
	let is_visible = true;

	return {
		is_displayed () {
			return is_visible && authService.is_logged_in();
		},
		toggle () {
			is_visible = !is_visible;
		},
		hide () {
			is_visible = false;
		},
		show () {
			is_visible = true;
		}
	};
});

