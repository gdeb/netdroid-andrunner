/*jslint node: true */
'use strict';

angular.module('authentication').factory('authService', function ($http, $rootScope, $cookieStore, user_roles, access_levels, AUTH_EVENTS) {
    let user_cookie = $cookieStore.get('user') || {role: 1};
    $cookieStore.remove('user');

    let user = {
        name: user_cookie.username,
        role: user_cookie.role,
        fullname: user_cookie.fullname,
    };

	let authentication = {
        access_levels: access_levels,
        user_roles: user_roles,
        user: user
    };

	authentication.login = function (credentials) {
        return $http.post('/login', credentials)
            .success(function (data) {
                if (data.result === 'success') {
                	user.role = data.role;
                	user.name = data.username;
                    user.fullname = data.fullname;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                } else {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);                    
                }
            });
	};

    authentication.logout = function () {
        return $http.post('/logout', {})
            .success(function () {
                user.role = 1;
                user.name = null;
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, user);
            });
    };

    authentication.authorize = function (access, role) {
        console.log(access, role, user.role);
        return access & (role ? role : user.role);
    };

    authentication.is_logged_in = function () {
        return user.role > 1;
    };

	return authentication;
});

