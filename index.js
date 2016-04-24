var cool = require('cool-ascii-faces');
var express = require('express');
var gets = require('./gets');
var posts = require('./posts');
var app = express();
var router = express.Router();

var getUsers = gets.getAllUsers;

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


router.route('/users').get(getUsers).post(postNewUser);

app.use(express.static(__dirname + '/public'), router);