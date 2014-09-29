var mysql   = require('mysql'),
    express = require('express'),
    fs = require("fs");

var app = express();

app.set('port', process.env.PORT || 3000)

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root'
});

connection.connect();

console.log('Sistema de importação iniciado!')

var url = "/home/fabricio/Projetos/gmaps/app/json"
var files = fs.readdirSync(url);
var cidade = "";
var dataArray = [];
var data = [];
var cont = 0;
var nomeCidade = "";
var siglaEstado = "";

function getCoordenadas(arrayCoordenada, posicaoCoordenada, arrayCidade, posicaoCidade){
  cidade = "";
  for (var i = 2; i < 9; i++){
    cidade = cidade + arrayCoordenada[i];
    if(i + 1 == 9){
      if(cont == 0){
        var urlCidade = "select descricao, estado from gmaps.cidade where codigo = " + cidade;
        connection.query(urlCidade, function(err, rows, fields) {
          if (err) {
            console.log("ERRO 1: " + cidade + " - " + objCoordenada);
          }
          nomeCidade = rows[0].descricao;
          siglaEstado = rows[0].estado;
          cont = 1;
          dataArray = JSON.parse(arrayCoordenada);
          console.log(dataArray[cidade][posicaoCoordenada] + " - " + posicaoCoordenada + " - " + cidade + " - " + nomeCidade);
          setTimeout(function(){
            savarCoordenada(dataArray[cidade][posicaoCoordenada], arrayCoordenada, posicaoCoordenada, dataArray[cidade], arrayCidade, posicaoCidade, cidade, nomeCidade, siglaEstado);
          }, 1);
        });
      }else{
        dataArray = JSON.parse(arrayCoordenada);
        console.log(dataArray[cidade][posicaoCoordenada] + " - " + posicaoCoordenada + " - " + cidade + " - " + nomeCidade);
        setTimeout(function(){
          savarCoordenada(dataArray[cidade][posicaoCoordenada], arrayCoordenada, posicaoCoordenada, dataArray[cidade], arrayCidade, posicaoCidade, cidade, nomeCidade, siglaEstado);
        }, 1);
      }
    }
  }
};

function getCidade(arrayCidade, posicaoCidade){
  data = fs.readFileSync("/home/fabricio/Projetos/gmaps/app/json/"+ arrayCidade[posicaoCidade], "utf8");
  cont = 0;
  getCoordenadas(data, 0, arrayCidade, posicaoCidade);
};

function savarCoordenada(objCoordenada, arrayCoordenada, posicaoCoordenada, objCoordenadaCidade, arrayCidade, posicaoCidade, cidade, nomeCidade, siglaEstado){
  var urlSalvar = 'INSERT INTO gmaps.coordenada values (' + cidade + ', ' + '"' +nomeCidade +'"' + ', '+ '"' +siglaEstado +'"'+ ', ' + objCoordenada.split(",")[0] + ', ' + objCoordenada.split(",")[1] + ')';
  console.log(urlSalvar);
  connection.query(urlSalvar, function(err, rows, fields) {
    if (err) {
      console.log("ERRO 2: " + cidade + " - " + objCoordenada);
    }
    if(objCoordenadaCidade.length > posicaoCoordenada + 1) {
      getCoordenadas(arrayCoordenada, posicaoCoordenada + 1, arrayCidade, posicaoCidade);
    }else{
      if(arrayCidade.length > posicaoCidade + 1){
        getCidade(arrayCidade, posicaoCidade + 1);
      }
    }
  });
};

getCidade(files, 0);


