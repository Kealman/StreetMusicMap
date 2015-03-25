'use strict';

angular.module('streetMusicMap')
  .controller('MainCtrl',
  ['$scope',
    'Restangular',
    'events',
    'cities',
    function ($scope, Restangular, events, cities) {

      var restEvents = Restangular.all('events');


      function getEmptyForm () {
          return {
              name: "",
              desc: "",
              lat: 0,
              lng: 0
          }
      }

      function setEvents (events) {
        $scope.events = events;

        events.forEach(function(item){
          $scope.markers[item.name] = {
            lat: item.lat,
            lng: item.lng,
            message: item.name
          }
        });
      }

      function init(){
        $scope.markers = {};
        $scope.newEventForm = getEmptyForm();
        $scope.newEvent = false;

        $scope.content = "list";
        $scope.cities = cities;
        $scope.activeCity = cities[0];


        setEvents(events);

        $scope.center = {
          lat: $scope.activeCity.lat,
          lng: $scope.activeCity.lng,
          zoom: $scope.activeCity.zoom
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

        $scope.toggleNewEvent = function(){
           $scope.newEvent = !$scope.newEvent;

           if($scope.newEvent) {
             $scope.content = "new";
           } else {
             $scope.content = "list";
             delete $scope.markers.newPoint;
             $scope.newEventForm = getEmptyForm();
           }
        };

        $scope.toggleMarkerFocus = function(marker, focus){
           $scope.markers[marker.name].focus = focus;
        }
      }


      $scope.mapEvents = {
        map: {
          enable: ['click'],
            logic: 'emit'
        }
      };

      init();

      $scope.$on('leafletDirectiveMap.click', function(event, lev){
        if(!$scope.newEvent) {
          return;
        }

        $scope.markers.newPoint = {
          lat: lev.leafletEvent.latlng.lat,
          lng: lev.leafletEvent.latlng.lng,
          //message: "I want to travel here!",
          //focus: false,
          draggable: true
        };

        $scope.content = "new";


        //console.log(event);
      });

      $scope.$watch('activeCity', function(newValue){
        console.log(newValue);
      });


      $scope.rt = function (activeCity) {
        $scope.center = {
          lat: activeCity.lat,
          lng: activeCity.lng,
          zoom: activeCity.zoom
        };
      };

      $scope.saveNewEvent = function(eventForm){
        angular.extend(eventForm, {
          lat: $scope.markers.newPoint.lat,
          lng: $scope.markers.newPoint.lng
        });

        restEvents
        .post(eventForm)
        .then(function(){
            $scope.toggleNewEvent();
            return restEvents
              .getList();
          })
        .then(function(events){
              setEvents(events);
          });
      }
  }]);
