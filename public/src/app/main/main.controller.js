'use strict';

angular.module('streetMusicMap')
  .controller('MainCtrl', function ($scope) {
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

    $scope.markers = {
      osloMarker: {
        lat: 59.9436433,
        lng: 30.3039746,
        message: "I want to travel here!",
        focus: false,
        draggable: true
      }
    };

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
      console.log(event);
    });

  });
