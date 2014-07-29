/*jslint node: true */
'use strict';

angular.module('viewCards', []);

require('./cardsCtrl.js');

angular.module('viewCards').config(['$routeProvider', 'user_roles', 'access_levels', function($routeProvider, roles, access) {

    $routeProvider.
        when('/cards', {
            templateUrl: 'templates/partial-cards.html',
            controller: 'CardsController',
            access: access.user,
        });
}]);

