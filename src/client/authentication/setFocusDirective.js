
angular.module('authentication').directive('anrSetFocus', function () {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => element[0].focus()
    };    
});

