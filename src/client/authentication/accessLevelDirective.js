
angular.module('authentication').directive('accessLevel', ['authService', function(auth) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display');
            $scope.$watch('main.user.role', function(role) {
                if(!auth.authorize(attrs.accessLevel))
                    element.css('display', 'none');
                else
                    element.css('display', prevDisp);
            });
        }
    };
}]);