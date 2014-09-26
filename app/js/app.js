'use strict'

angular.module('appGoogleMaps', []).controller('ctrlGoogleMaps', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){

  angular.extend($scope, {
    estado: "-1",
    cidade: "-1",
    select: {
      estado: [],
      cidade: []
    }
  });

  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(24.886436490787712, -70.2685546875),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var googleMaps = null;

  var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

  $http({method: 'GET', url: '/estado'}).success(function(data, status, headers, config) {
    $scope.select.estado = data;
  });

  $scope.getCidades = function(estado){
    $scope.cidade = "-1";
    $http({method: 'GET', url: '/cidade/' + estado }).success(function(data, status, headers, config) {
      $scope.select.cidade = data;
    });
  };

  $scope.getPolygons = function(cidade){
    $http({method: 'GET', url: '/json/' + cidade + '.json' }).success(function(data, status, headers, config) {
      $scope.colorir(data[cidade]);
    });
  };

  $scope.colorir = function(data){

    if(angular.isObject(googleMaps)){
      googleMaps.setMap(null);
    };

    map.setCenter(new google.maps.LatLng(data[0].split(",")[0],data[0].split(",")[1]));

    var coords = [];
    for (var i = 0; i < data.length; i++){
      coords.push(new google.maps.LatLng(data[i].split(",")[0], data[i].split(",")[1]))
    };

    googleMaps = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });

    googleMaps.setMap(map);
  };

}]);