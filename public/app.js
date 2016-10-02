var app = angular.module('myAPP', ['ngRoute']);

// app.run(function ($rootScope) {
//     $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
//         var word = current.$$route.originalPath.slice(1);
//         $rootScope.active = word;
//         word = word.charAt(0).toUpperCase() + word.slice(1);        
//         angular.element(document.querySelector('#nav-title')).text(word);
//     });
// });

app.config(function($routeProvider) {
  $routeProvider
  .when('/dashboard', {
    templateUrl : 'dashboard.html',
    controller  : 'DashboardController'
  })  
  .when('/profile', {
    templateUrl : 'profile.html',
    controller  : 'profileController'
  })
  .otherwise({redirectTo: '/dashboard'});
});

app.controller('DashboardController', function($scope) {
  $scope.message = 'Hello from Dashbaord';
});

app.controller('profileController', function($scope, $http) {
  $scope.message = 'Hello from profile';
  $scope.user = {};  
});

app.controller('navController', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
    $scope.testVar = $location.path();
});

