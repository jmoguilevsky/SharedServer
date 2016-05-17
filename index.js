var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')

var gets = require('./gets');
var posts = require('./posts');
var puts = require('./puts');
var deletes = require('./deletes');
var app = express();
var router = express.Router();

var getUsers = gets.getAllUsers;
var getInterests = gets.getAllInterests;
var getUser = gets.getUser;
var getUserPhoto = gets.getUserPhoto;
var postUser = posts.postNewUser;
var postInterest = posts.postNewInterest;
var putUpdateUser = puts.putUser;
var putUpdatePhoto = puts.putPhoto;
var deleteUser = deletes.deleteUser;

app.use(bodyParser.json());
app.use(express.bodyParser({limit: '5mb'}));

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('api', __dirname);
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

router.route('/').get(function(request, response) {
  response.render('pages/index');
});

router.route('/users').get(getUsers).post(postUser);
router.route('/users/:idUser').get(getUser).put(putUpdateUser).delete(deleteUser);
router.route('/users/:idUser/photo').put(putUpdatePhoto).get(getUserPhoto);
router.route('/interests').get(getInterests).post(postInterest);

app.use(express.static(__dirname + '/views'), router);