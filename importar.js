var mysql   = require('mysql'),
		express = require('express'),
    fs = require("fs");

var url = "/home/fabricio/Projetos/gmaps/app/json"
var files = fs.readdirSync(url);
var cidade = "";
var dataArray = [];
var data = [];

function getCoordenadas(arrayCoordenada, posicaoCoordenada, arrayCidade, posicaoCidade){
  cidade = "";
  for (var i = 2; i < 9; i++){
    cidade = cidade + arrayCoordenada[i];
  }
  dataArray = JSON.parse(arrayCoordenada);
  console.log(arrayCoordenada.toString());
  savarCoordenada(dataArray[cidade][posicaoCoordenada], arrayCoordenada, posicaoCoordenada, dataArray[cidade], arrayCidade, posicaoCidade);
};

function getCidade(arrayCidade, posicaoCidade){
  data = fs.readFileSync("/home/fabricio/Projetos/gmaps/app/json/"+ arrayCidade[posicaoCidade], "utf8");
  getCoordenadas(data, 0, arrayCidade, posicaoCidade);
};

function savarCoordenada(objCoordenada, arrayCoordenada, posicaoCoordenada, objCoordenadaCidade, arrayCidade, posicaoCidade){
  if(objCoordenadaCidade.length > posicaoCoordenada + 1) {
    getCoordenadas(arrayCoordenada, posicaoCoordenada + 1, arrayCidade, posicaoCidade);
  }else{
    if(arrayCidade.length > posicaoCidade + 1){
      getCidade(arrayCidade, posicaoCidade + 1);
    }
  }
};

getCidade(files, 0);

var app = express();

app.set('port', process.env.PORT || 3000)

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root'
});

connection.connect();


/*app.get('/pais', function(req, res){
	connection.query('SELECT * FROM gmaps.pais', function(err, rows, fields) {
  	if (err) throw res.sendStatus(404);
  	res.send(rows);
	});
});*/

console.log('Sistema de importação iniciado!')
