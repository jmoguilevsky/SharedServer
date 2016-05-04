module.exports = function() {
    var pg = require('pg');
    var version = 0.1;

    function querSelectInterest(interest) {
        return 'select id from Interest where value =\'' + interest.value + '\' and category = \'' + interest.category + '\';'
    }

    function queryInsertInterest(interest) {
        return 'INSERT INTO Interest (category, value) values (\'' + interest.category + '\', \'' + interest.value + '\');'
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
    function insertUserInterest(interest, idUser, client, done, err, response, status, body) {
        //First I check if the Interest already exists
        var idInterest = 0;
        client.query(querSelectInterest(interest), function(err, result) {
            if (result.rows === 0) {
                client.query(queryInsertInterest(interest), function(err) {
                    if (err) {
                        return false;
                    }
                    client.query(querSelectInterest(interest), function(err, result) {
                        idInterest = result.rows[0]['id'];
                    });
                });
            } else {
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
        console.log('request body');
        //console.log(request.body);
        var user = request.body.user;
        console.log('user\n' + user);
        var interests = request.body.user.interests;

        var selectLastUser =
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

                        interests.forEach(function(interest) {
                            var ok = insertUserInterest(interest, idUser, client);
                            if (ok === false) {
                                return rollback(client, done, err, response, status, 'Error al guardar los intereses');
                            }
                        });

                        console.log('Se guardo ok');
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