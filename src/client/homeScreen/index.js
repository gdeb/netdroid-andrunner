/*jslint node: true */
'use strict';

angular.module('homeScreen', []);

require('./homeCtrl.js');

angular.module('homeScreen').config(['$routeProvider', 'access_levels', function($routeProvider, access) {

    $routeProvider.
        when('/', {
            templateUrl: 'templates/home.html',
            controller: 'homeCtrl',
            access: access.public,
        }).
        otherwise({
            redirectTo: '/',
        });
}]);

