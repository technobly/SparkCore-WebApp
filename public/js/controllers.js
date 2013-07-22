'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function($scope, $http) {
    console.log("AppCtrl");
    // Write AppCtrl here

  }).
  controller('Ctrl1', function ($scope, $rootScope, $http) {
    console.log("Ctrl1");
    // Default state of all I/O, true = HIGH, false = LOW
    $scope.a0chkd = true;
    $scope.a1chkd = true;
    $scope.a2chkd = true;
    $scope.a3chkd = true;
    $scope.a4chkd = true;
    $scope.a5chkd = true;
    $scope.a6chkd = true;
    $scope.a7chkd = true;
    $scope.d0chkd = true;
    $scope.d1chkd = true;
    $scope.d2chkd = true;
    $scope.d3chkd = true;
    $scope.d4chkd = true;
    $scope.d5chkd = true;
    $scope.d6chkd = true;
    $scope.d7chkd = true;

    $rootScope.deviceName = "elroy";
    $scope.deviceName = "elroy";
    $scope.response = "";

    // Digital Outputs call this function
    $scope.digitalWrite = function (pin) {
      var lowerpin = pin.toLowerCase();
      var level = eval("\$scope\." + lowerpin + "chkd");
      if(level) level = "HIGH";
      else level = "LOW";
      //console.log("Ctrl1:"+pin+":"+level+"https://api.sprk.io/v1/devices/"+$rootScope.deviceName);
      $http.post("https://api.sprk.io/v1/devices/"+$rootScope.deviceName,
        { "pin": pin, "level": level } // JSON Data
      ).success(function(response, status, headers, config) {  
        if(response.ok === true) {
          if($scope.response == "Success!")
            $scope.response = "Success! :)";
          else
            $scope.response = "Success!";
          $scope.error = "";
        }
        else if(response.ok === false) {
          var temp = JSON.stringify(response.errors).replace(/\[|\]/g,"").replace(/\,/,"\,\n");
          if($scope.response == temp)
            $scope.response = temp + " :(";
          else 
            $scope.response = temp;
          $scope.error = response.errors;
        }
        //console.log(JSON.stringify(response, null, ' '));
      }).error(function(response, status, headers, config) {
        if(response.ok === false) {
          $scope.response = JSON.stringify(response.errors);
          $scope.error = response.errors;
        }
      });

    };

    // When Device Name is changed, update global deviceName used in https calls
    $scope.deviceChanged = function () {
      $rootScope.deviceName = $scope.deviceName;
    }

  }).
  controller('Ctrl2', function ($scope) {
    console.log("Ctrl2");
    // Write Ctrl2 here
    
  });
