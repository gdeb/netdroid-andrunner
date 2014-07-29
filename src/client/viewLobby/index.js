/*jslint node: true */
'use strict';

angular.module('viewLobby', []);

require('./lobbyCtrl.js');

angular.module('viewLobby').config(['$routeProvider', 'user_roles', 'access_levels', function($routeProvider, roles, access) {

    $routeProvider.
        when('/lobby', {
            templateUrl: 'templates/partial-lobby.html',
            controller: 'LobbyController',
            access: access.user,
        });
}]);

