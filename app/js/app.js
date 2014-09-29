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

  $("body").mousemove(function(e){
    $("#tooltip").css({
      "margin-left": e.pageX+15,
      "margin-top": e.pageY+5
    });
  });

  $("body").append('<div id="tooltip"></div>');
  $("#tooltip").css("display", "none");

  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(-12.12527949751654, -56.030248437499955),
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

  $scope.colorirCidade = function(dados) {

    map.setCenter(new google.maps.LatLng(dados[0].latitude,dados[0].longitude));

    var coords = [];

    for (var i = 0; i < dados.length; i++){
      coords.push(new google.maps.LatLng(dados[i].latitude, dados[i].longitude));
    };

    googleMaps = new google.maps.Polygon({
      cidade: dados[0],
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });

    googleMaps.setMap(map);
    $scope.adicionarEventos(googleMaps);
  };

  $scope.colorirEstado = function(dados) {

    //map.setCenter(new google.maps.LatLng(data[0].split(",")[0],data[0].split(",")[1]));

    var coords = [];
    var cidade = dados[0].cidade;

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
        $scope.adicionarEventos(googleMaps);
        coords = [];
        cidade = dados[i].cidade;
      }else{
        coords.push(new google.maps.LatLng(dados[i].latitude, dados[i].longitude));
      }
    };
  };

  $scope.adicionarEventos = function(googleMaps) {
    google.maps.event.addListener(googleMaps,"mouseover",function(e){
      $("#tooltip").html(googleMaps.cidade.descricaoCidade);
      $("#tooltip").css("display", "block");
    });

    google.maps.event.addListener(googleMaps,"mouseout",function(e){
      $("#tooltip").css("display", "none");
    });

    google.maps.event.addListener(googleMaps,"click",function(){
      $(".modal").modal("show");
    });
  };


  $scope.getPolygons = function(estado, cidade){

    var url;

    if(angular.isObject(googleMaps)){
      googleMaps.setMap(null);
    };

    if(cidade == "-1"){
      url = '/coordenada/estado/' + estado;
    }else{
      url = '/coordenada/cidade/' + cidade;
    }

    $http({method: 'GET', url: url }).success(function(dados, status, headers, config) {
      if(cidade == "-1"){
        $scope.colorirEstado(dados);
      }else{
        $scope.colorirCidade(dados);
      }
    });
  };
}]);