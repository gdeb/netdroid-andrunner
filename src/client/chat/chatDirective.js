/*jslint node: true */
'use strict';

angular.module('chat').directive('anrChat', function (wsService) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/partial-chat.html',
        link: function (scope, element) {
        	scope.msg_list = [];
        	scope.chatmsg = "";
        	scope.testf = function () {
        		if (scope.chatmsg !== "") {
	        		wsService.send('/sendchat', scope.chatmsg);
					scope.chatmsg = "";        			
        		}
        	}; 

        	wsService.add_route({
        		url:'/new_msg',
        		controller: function (msg) {
        			console.log('yep', msg);
        			scope.msg_list.push(msg);
        			scope.$apply();
        		}
        	});
        },
    };    
});

