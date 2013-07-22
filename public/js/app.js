'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider.

    when('/', {
      controller: 'Ctrl1'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);

  //$httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
});
