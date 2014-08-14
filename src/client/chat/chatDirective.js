
angular.module('chat').directive('anrChat', function (wsService) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/partial-chat.html',
        link: function (scope, element) {
        	scope.test = "nrst";
        	scope.chatmsg = "ab";
        	scope.testf = function () {
				console.log('hello nrst', scope.chatmsg);
				scope.chatmsg = "";
	        	wsService.send('/sendchat', 'hello');
        	}; 
        },
    };    
});

