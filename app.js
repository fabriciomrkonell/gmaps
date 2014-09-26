var mysql   = require('mysql'),
		express = require('express'),
		http		= require('http'),
		path    = require('path');

var app = express();

app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/')
app.use(express.static(path.join(__dirname, 'app')))

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root'
});

connection.connect();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/pais', function(req, res){
	connection.query('SELECT * FROM gmaps.pais', function(err, rows, fields) {
  	if (err) throw res.sendStatus(404);
  	res.send(rows);
	});
});

app.get('/estado', function(req, res){
	connection.query('SELECT * FROM gmaps.estado', function(err, rows, fields) {
  	if (err) throw res.sendStatus(404);
  	res.send(rows);
	});
});

app.get('/cidade', function(req, res){
	connection.query('SELECT * FROM gmaps.cidade', function(err, rows, fields) {
  	if (err) throw res.sendStatus(404);
  	res.send(rows);
	});
});

app.get('/cidade/:estado', function(req, res){
  var url = 'SELECT * FROM gmaps.cidade where estado = "' + req.param('estado') + '"'
	connection.query(url, function(err, rows, fields) {
  	if (err) throw res.sendStatus(404);
  	res.send(rows);
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('GMaps rodando!')
})
