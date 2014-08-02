/*jslint node: true */
'use strict';

angular.module('chat', []);

require('./chatFactory.js');
require('./webSocketFactory.js');

angular.module('authentication').run(['$rootScope', 'AUTH_EVENTS', 'chatFactory', function ($rootScope, AUTH_EVENTS, chat) {
    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
        chat.hide();
    });
    // $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
    //     chat.hide();
    // });
}]);
