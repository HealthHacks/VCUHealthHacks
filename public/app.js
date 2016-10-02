var app = angular.module('myAPP', ['ngRoute']);

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

app.controller('DashboardController', function($scope, $rootScope, $http) {
  $scope.message = 'Hello from Dashbaord';
  $http.get('/pillsInventory')
  .success(function (data) {
    $scope.pillsInventory = data.pills;
    // console.log($scope.pillsInventory);
  })
  .error(function (error) {
    console.log(error);
  });  

  var host = location.origin.replace(/^http/, 'ws'); 
  var ws = new WebSocket(host);
  $scope.sensorData = {};  			
  ws.onopen = function(event) {
    console.log("Connected");
    setInterval(function() {
      ws.send('ping');
    }, 24000);
  };			
  ws.onmessage = function (event) { 
    //console.log(event);
    // event.data = angular.fromJson(event.data);        
    $rootScope.$apply(function () {
        var parsedData = angular.fromJson(event.data);        
        var remapped = {}
        for(var i = 0; i < parsedData.pills.length; i++) {          
          var currentPill = parsedData.pills[i];
          var name = currentPill.name;          
          remapped[name] = currentPill.correct                    
        }
        $scope.sensorData = remapped;
    });
  };  
});

app.controller('profileController', function($scope, $http) {
  $scope.message = 'Hello from profile';
  $scope.user = sampleUser;
});

app.controller('navController', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
    $scope.testVar = $location.path();
});

app.run(function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {        
        var word = current.$$route.originalPath.slice(1);        
        $rootScope.active = word;
        word = word.charAt(0).toUpperCase() + word.slice(1);        
        angular.element(document.querySelector('#nav-title')).text(word);
    });
});



var sampleUser = {
  "_id": "56c66be5a73e492741507272",
  "address": {
    "city": "Union",
    "state": "Kentucky",
    "street_name": "Lakeview Drive",
    "street_number": "11028",
    "zip": "41091"
  },
  "first_name": "Allison",
  "last_name": "Williams"
};