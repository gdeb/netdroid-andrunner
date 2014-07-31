
angular.module('authentication').factory('authService', function ($http, $rootScope, $cookieStore, user_roles, access_levels, AUTH_EVENTS) {
    let user_cookie = $cookieStore.get('user') || {role: 1};
    $cookieStore.remove('user');

    $rootScope.user = {
        name: user_cookie.username,
        role: user_cookie.role,
    };
    $rootScope.access = access_levels;

	let authentication = {
        access_levels: access_levels,
        user_roles: user_roles,
    };

	authentication.login = function (credentials) {
        return $http.post('/login', credentials)
            .success(function (data) {
                if (data.result === 'success') {
                	$rootScope.user.role = data.role;
                	$rootScope.user.name = data.username;
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                } else {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);                    
                }
            });
	};

    authentication.logout = function () {
        return $http.post('/logout', {})
            .success(function (data) {
                $rootScope.user.role = 1;
                $rootScope.user.name = null;
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
    }

    authentication.authorize = function (access, role) {
        return access & (role ? role : $rootScope.user.role);
    };

    authentication.is_logged_in = function () {
        return $rootScope.user.role > 1;
    };

	return authentication;
});

