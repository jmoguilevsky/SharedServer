var pg = require('pg');
var cool = require('cool-ascii-faces');
var express = require('express');
var gets = require('./gets');
var app = express();
var router = express.Router();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/db', function (request, response) {
    pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM usuario', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
})

/*
app.get('/users', function (request, response) {
    var query = "select row_to_json(usuario) from usuario;";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(query, function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err); 
			} else {
				response.send(result.rows) ;
			}
		});
	});
})
*/

router.route('/users').get(getAllUsers);
