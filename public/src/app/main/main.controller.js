'use strict';

angular.module('streetMusicMap')
  .controller('MainCtrl',
  ['$scope',
    'Restangular',
    function ($scope, Restangular) {
      $scope.markers = {};
      if(!$scope.test){
        console.log($scope.test);
        $scope.test = 1;
      }else{
        console.log($scope.test);
      }
      $scope.content = "new";
      //$scope.content.view = "new";

      Restangular.all('events')
      .getList()
      .then(function(res){
        res.forEach(function(item){
          $scope.markers[item.name] = {
            lat: item.lat,
            lng: item.lng,
            message: item.name
          }
        });
      });

      $scope.center = {
        lat: 59.9436433,
        lng: 30.3039746,
        zoom: 11
      };

      $scope.layers = {
        baselayers: {
          googleTerrain: {
            name: 'Google Terrain',
              layerType: 'TERRAIN',
              type: 'google'
          },
          googleHybrid: {
            name: 'Google Hybrid',
              layerType: 'HYBRID',
              type: 'google'
          },
          googleRoadmap: {
            name: 'Google Streets',
              layerType: 'ROADMAP',
              type: 'google'
          }
        }
      };

      //$scope.markers = {
      //  osloMarker: {
      //    lat: 59.9436433,
      //    lng: 30.3039746,
      //    message: "I want to travel here!",
      //    focus: false,
      //    draggable: true
      //  }
      //};

      $scope.events = {
        map: {
          enable: ['click'],
            logic: 'emit'
        }
      };



      $scope.$on('leafletDirectiveMap.click', function(event, lev){
        $scope.markers.newPoint = {
          lat: lev.leafletEvent.latlng.lat,
          lng: lev.leafletEvent.latlng.lng,
          //message: "I want to travel here!",
          //focus: false,
          draggable: true
        };

        $scope.$watch('markers.newPoint.lat', function(newValue, oldValue){
          console.log(oldValue);
          if(oldValue){
            console.log('event');
          }
        });
        //console.log(event);
      });

  }]);
