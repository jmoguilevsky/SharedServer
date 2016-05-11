var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var gets = require('./gets');
var posts = require('./posts');
var puts = require('./puts');
var app = express();
var router = express.Router();

var getUsers = gets.getAllUsers;
var getUser = gets.getUser;
var postUser = posts.postNewUser;
var putUpdateUser = puts.putUser;
var putUpdatePhoto = puts.putPhoto;

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


router.route('/users').get(getUsers).post(postUser);
router.route('/users/:idUser').get(getUser).put(putUpdateUser);
router.route('/users/:idUser/photo').put(putUpdatePhoto);

app.use(express.static(__dirname + '/public'), router);