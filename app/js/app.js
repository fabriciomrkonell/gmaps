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

  $scope.getCoooooo = function(datare, posicao){
    $http({method: 'GET', url: '/json/' + datare[posicao].codigo + '.json' }).success(function(data, status, headers, config) {
      console.log(data);
      $scope.salvarCoooooo(datare, posicao, data[datare[posicao].codigo], 0)
    });
  };

  $scope.salvarCoooooo = function(datare, posicao, dados, posicao2){
    $scope.Salvaroooooo(dados, posicao2, datare, posicao);
  };

  $scope.Salvaroooooo = function(dados, posicao2, dados2, posicao){
    var url = '/adicionar?cidade=' + dados2[posicao].codigo + '&lat=' + dados[posicao2].split(",")[0] + '&long=' + dados[posicao2].split(",")[1];
    $http({method: 'GET', url: url }).success(function(data, status, headers, config) {
      if(dados.length != posicao2 +1){
        $scope.Salvaroooooo(dados, posicao2 + 1, dados2, posicao);
      }else{
        if(dados2.length != posicao +1){
          $scope.getCoooooo(dados2, posicao + 1);
        }
      }
    });
  };

  var _cidades = [];
  $scope.colorir = function(data){

    if(angular.isObject(googleMaps)){
      googleMaps.setMap(null);
    };


    //map.setCenter(new google.maps.LatLng(data[0].split(",")[0],data[0].split(",")[1]));


    $http({method: 'GET', url: '/coordenada' }).success(function(dados, status, headers, config) {

      var coords = [];
      var cidade = dados.cidades[0].cidade;
      dados = dados.cidades;

      for (var i = 0; i < dados.length; i++){
        if(cidade != dados[i].cidade){
          googleMaps = new google.maps.Polygon({
            cidade: dados[i],
            paths: coords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          });

          googleMaps.setMap(map);

          google.maps.event.addListener(googleMaps,"mouseover",function(){
            this.setOptions({fillColor: "#00FF00"});
          });

          google.maps.event.addListener(googleMaps,"click",function(a,b,c,d,e){
            console.log(this.cidade);
          });

          coords = [];

          cidade = dados[i].cidade;
        }else{
          coords.push(new google.maps.LatLng(dados[i].latitude, dados[i].longitude));
        }
      };

    });
  };

}]);