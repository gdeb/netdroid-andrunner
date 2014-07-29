
angular.module('authentication').factory('authService', function ($http, $rootScope, $cookieStore, user_roles, access_levels) {
    let user_cookie = $cookieStore.get('user') || {role: 1};
    $cookieStore.remove('user');

    $rootScope.user = {
        name: user_cookie.username,
        role: user_cookie.role,
    };

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
                }
            });
	};

    authentication.logout = function () {
        return $http.post('/logout', {})
            .success(function (data) {
                console.log(data);
                $rootScope.user.role = 1;
                $rootScope.user.name = null;
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

