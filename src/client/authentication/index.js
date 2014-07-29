/*jslint node: true */
'use strict';

angular.module('authentication', ['ngCookies']);

require('./accessLevelDirective.js');
require('./authService.js');
require('./loginCtrl.js');
require('./setFocusDirective.js');

let common_auth = require('../../common/authentication.js');

angular.module('authentication')
    .constant('user_roles', common_auth.user_roles);

angular.module('authentication')
    .constant('access_levels', common_auth.access_levels);

angular.module('authentication').run(['$rootScope', '$location', 'authService', function ($rootScope, $location, auth) {
    $rootScope.$on("$routeChangeStart", function (event, next) {
        if (!auth.authorize(next.access)) {
            if(auth.is_logged_in()) $location.path('/');
            else                  $location.path('/login');
        }
    });
}]);

angular.module('authentication').config(['$routeProvider', 'access_levels', function($routeProvider, access) {
    $routeProvider.
        when('/login', {
            templateUrl: 'templates/partial-login.html',
            controller: 'LoginController',
            access: access.public,
        }).
        when('/logout', {
            resolve: {
                logout: authService => authService.logout()
            },
            redirectTo: '/',
        }).
        when('/register', {
            templateUrl: 'templates/partial-register.html',
            access: access.public,
        });
}]);

