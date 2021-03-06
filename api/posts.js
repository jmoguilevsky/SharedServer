var getQuerys = require('../querys/gets.js');
var postQuerys = require('../querys/inserts.js');

module.exports = function() {
    var pg = require('pg');
    var version = 0.1;

    function postNewUser(request, response) {

        var body = 'Error';
        //console.log(request.body);
        var user = request.body.user;
        console.log('user\n' + user);
        var interests = request.body.user.interests;
        var query = postQuerys.insertUserWithInterests(user);
        console.log(query);
        //var selectInterest = 'SELECT id from UserProfile where email = \'' + user.email + '\' ;';
        var idUser = 0;

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err) {
                if (err) {
                    body = {
                        error: 'No se pudo guardar el usuario',
                        metadata: request.body.metadata
                    };
                    response.status(400).send(body);
                } else {
                    console.log('Se guardo ok');
                    client.query(getQuerys.getUserId(user), function(err, result) {
                        if (err) {
                            body = {
                                error: 'error al obtener el id del usuario guardado',
                                metadata: request.body.metadata
                            };
                            response.status(400).send(body);
                        } else {
                            user.id = result.rows[0]['id'];
                            body = {};
                            body.user = user;
                            body.metadata = request.body.metadata;
                            response.status(201).send(body);
                        }
                    });
                }
            });
        });
    }

    function postNewInterest(request, response) {

        var body = 'Error';
        //console.log(request.body);
        var interest = request.body.interest;
        console.log('interest\n' + interest);
        var query = postQuerys.insertInterest(interest, ';');
        console.log(query);
        //var selectInterest = 'SELECT id from UserProfile where email = \'' + user.email + '\' ;';
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err) {
                if (err) {
                    body = {
                        error: 'No se pudo guardar el interes',
                        metadata: request.body.metadata
                    };
                    response.status(400).send(body);
                } else {
                    console.log('Se guardo ok');
                    body = {};
                    body.interest = interest;
                    body.metadata = request.body.metadata;
                    response.status(201).send(body);
                }
            });
        });
    }

    return {
        postNewUser: postNewUser,
        postNewInterest: postNewInterest
    }
}();