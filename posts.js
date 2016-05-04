module.exports = function() {
    var pg = require('pg');
    var version = 0.1;

    function querSelectInterest(interest) {
        return 'select id from Interest where value =\'' + interest.value + '\' and category = \'' + interest.category + '\';'
    }

    function queryInsertInterestForUser(interest, idUser) {
        return 'DO $$'+
        		'DECLARE idNewInterest int;'+
        		'INSERT INTO Interest (category, value) values (\'' + interest.category + '\', \'' + interest.value + '\')'+
        		'RETURNING id INTO idNewInterest;'+
        		'INSERT INTO UserInterest (idUser, idInterest) values (' + idUser + ', idNewInterest );'+
        		'END $$';
    }

    function queryInsertUserInterest(idUser, idInterest) {
        return 'INSERT INTO UserInterest (idUser, idInterest) values (' + idUser + ', ' + idInterest + ');'
    }

    function queryInsertUser(user) {
        return 'INSERT INTO UserProfile(name, alias, email, latitude, longitude) ' +
            'VALUES (\'' + user.name + '\', \'' + user.alias + '\', \'' + user.email + '\',' +
            user.location.latitude + ',' + user.location.longitude + ');';
    }

    function querySelectLastUser(user) {
        return 'SELECT id from UserProfile where email = \'' + user.email + '\' ;';
    }

    function rollback(client, done, error, response, status, body) {
        console.log(error);
        client.query('ROLLBACK', function(err) {
            done(err);
            response.status(status).send(body);
        });
    };

    //returns a bool if the interest was saved, otherwise was an error
    function insertUserInterest(interest, idUser, client) {
        //First I check if the Interest already exists
        console.log('insert interest ' + JSON.stringify(interest));
        var idInterest = 0;
        client.query(querSelectInterest(interest), function(err, result) {
            if (result.rows.length === 0) {
            	console.log('the interest didn\'t exist, i save it');
                client.query(queryInsertInterestForUser(interest,idUser), function(err) {
                    if (err) {
                        return false;
                    }
                });
            } else {
                console.log('interest id is \n' + result.rows[0]['id']);
                idInterest = result.rows[0]['id'];
            }
            client.query(queryInsertUserInterest(idUser, idInterest), function(err) {
                if (err) {
                    return false;
                }
                return true;
            });
        });
    }



    function postNewUser(request, response) {

        var status = 400;
        var body = 'Error';
        //console.log(request.body);
        var user = request.body.user;
        console.log('user\n' + user);
        var interests = request.body.user.interests;

        //var selectInterest = 'SELECT id from UserProfile where email = \'' + user.email + '\' ;';
        var idUser = 0;

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('BEGIN', function(err) {
                if (err) return rollback(client, done, err, response, status, body);
                client.query(queryInsertUser(user), function(err) {
                    if (err) {
                        return rollback(client, done, err, response, status, 'Error al guardar el usuario');
                    }
                    console.log('select user ');
                    client.query(querySelectLastUser(user), function(err, result) {
                        if (err || result.rows.length === 0) {
                            return rollback(client, done, err, response, status, 'Error al guardar el usuario');
                        }
                        console.log('New User Id\n' + JSON.stringify(result));
                        idUser = result.rows[0]['id'];

                        var interestsInserts = '';

                        for (var i = 0; i < interests.length; i++) {
                            var interest = interests[i];
                            var ok = insertUserInterest(interest, idUser, client);
                            console.log('status insert' + ok);
                            if (ok === false) {
                                console.log('Hubo un error');
                                return rollback(client, done, err, response, status, 'Error al guardar los intereses');
                            }
                        }

                        console.log('Se guardo ok va por el interes i', i);
                        user.id = idUser;

                        body = {};
                        body.user = user;
                        body.metadata = request.body.metadata;
                        client.query('COMMIT', client.end.bind(client));
                        response.status(201).send(body);
                    });
                });
            });
        });
    }

    return {
        postNewUser: postNewUser
    }
}();