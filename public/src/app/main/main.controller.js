'use strict';

angular.module('streetMusicMap')
  .controller('MainCtrl',
  ['$scope',
    'Restangular',
    'events',
    'cities',
    '$timeout',
    'leafletData',
    function ($scope, Restangular, events, cities, $timeout, leafletData) {

      var restEvents = Restangular.all('events');

      var markers = {};

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
        leafletData.getMap('mainMap')
        .then(function(map){
            events.forEach(function(item){
               var marker = L.marker([item.lat, item.lng]).bindPopup(item.name);
               marker.addTo(map);
               markers[item.id] = marker;
            });
          });

      }

      function setCenter(coords, zoom){
        return leafletData.getMap('mainMap')
          .then(function(map){
            var mapZoom = map.getZoom();
            var latlng = L.latLng(coords.lat, coords.lng);
            if(zoom !== mapZoom){
              map.setView(latlng);
              map.setZoom(zoom, {animate: true, easeLinearity: 0.99});
            } else {
              console.log('oan');
              map.panTo(latlng, {animate: true});
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
          // $scope.markers[marker.name].focus = focus;
        };

        $scope.moveToEvent = function(event){
          //$scope.markers[event.name].focus = true;
          setCenter({lat: event.lat, lng: event.lng}, 15).then(function(){
            markers[event.id].openPopup();
          });

        };

        $scope.setCity = function (activeCity) {
          setCenter({lat: activeCity.lat, lng: activeCity.lng}, activeCity.zoom);
        };
      }



      $scope.mapEvents = {
        map: {
          enable: ['click'],
            logic: 'emit'
        }
      };

      init();

      leafletData.getMap('mainMap')
      .then(function(map){
         // console.log(L.marker([0, 0]).addTo(map).getLatLng());
      });

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
