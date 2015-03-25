'use strict';

angular.module('streetMusicMap', ['ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'mgcrea.ngStrap', 'leaflet-directive'])
  .config([ '$stateProvider','$urlRouterProvider', 'RestangularProvider', function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        resolve: {
          events: ['Restangular',function(Restangular){
            return Restangular.all('events')
              .getList();
          }],
          cities: ['Restangular',function(Restangular){
            return Restangular.all('cities')
              .getList();
          }]
        },
        views: {
          'main': {
            templateUrl: 'app/main/views/layout.html',
            controller: 'MainCtrl'
          },
          'navbar@main': {
              templateUrl: 'app/main/views/navbar.html'
          },
          'map@main': {
            templateUrl: 'app/main/views/main.html'//,
            //controller: 'MainCtrl'
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
