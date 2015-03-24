'use strict';

angular.module('streetMusicMap', ['ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'mgcrea.ngStrap', 'leaflet-directive'])
  .config([ '$stateProvider','$urlRouterProvider', 'RestangularProvider', function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        views: {
          '': {
            templateUrl: 'app/main/views/layout.html'
          },
          'map@main': {
            templateUrl: 'app/main/views/main.html',
            controller: 'MainCtrl'
          },
          'content@main': {
            templateUrl: 'app/main/views/content.html'
          }
        }
        //templateUrl: 'app/main/main.html',
        //controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');

    RestangularProvider.setBaseUrl('/api');

  }]);
