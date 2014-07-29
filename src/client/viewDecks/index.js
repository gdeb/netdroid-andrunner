/*jslint node: true */
'use strict';

angular.module('viewDecks', []);

require('./decksCtrl.js');

angular.module('viewDecks').config(['$routeProvider', 'user_roles', 'access_levels', function($routeProvider, roles, access) {

    $routeProvider.
        when('/decks', {
            templateUrl: 'templates/partial-decks.html',
            controller: 'DecksController',
            access: access.user,
        });
}]);

