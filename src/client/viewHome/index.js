/*jslint node: true */
'use strict';

angular.module('viewHome', []);

require('./homeCtrl.js');

angular.module('viewHome').config(['$routeProvider', 'access_levels', function($routeProvider, access) {

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

