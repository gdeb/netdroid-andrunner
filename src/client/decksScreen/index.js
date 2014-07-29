/*jslint node: true */
'use strict';

angular.module('decksScreen', []);

require('./decksCtrl.js');

angular.module('decksScreen').config(['$routeProvider', 'user_roles', 'access_levels', function($routeProvider, roles, access) {

    $routeProvider.
        when('/decks', {
            templateUrl: 'templates/partial-decks.html',
            controller: 'DecksController',
            access: access.user,
        });
}]);

