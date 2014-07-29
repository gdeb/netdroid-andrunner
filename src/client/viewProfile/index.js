/*jslint node: true */
'use strict';

angular.module('viewProfile', []);

require('./profileCtrl.js');

angular.module('viewProfile').config(['$routeProvider', 'access_levels', function($routeProvider, access) {

    $routeProvider.
        when('/profile', {
            templateUrl: 'templates/partial-profile.html',
            controller: 'profileController',
            access: access.user,
        });
}]);

