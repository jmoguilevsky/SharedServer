module.exports = function() {
    var pg = require('pg');
    var version = 0.1;

    function rollback(client, done, error, response, status, body) {
        console.log(error);
        client.query('ROLLBACK', function(err) {
            done(err);
            response.status(status).send(body);
        });
    };


    function postNewUser(request, response) {

        var status = 400;
        var body = 'Error';
        console.log('request body');
        //console.log(request.body);
        var user = request.body.user;
        console.log('user\n' + user);
        var interests = request.body.user.interests;

        var insertUser = 'INSERT INTO \"USER\"(name, alias, email, latitude, longitude) ' +
            'VALUES (\'' + user.name + '\', \'' + user.alias + '\', \'' + user.email + '\',' +
            user.location.latitude + ',' + user.location.longitude + ');';
        var selectLastUser = 'SELECT id from \"USER\" where email = \'' + user.email + '\' ;';
        var idUser = 0;

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('BEGIN', function(err) {
                if (err) return rollback(client, done, err, response, status, body);
                console.log('insert user \n' + insertUser);
                client.query(insertUser, function(err) {
                    if (err) {
                        body = 'Error al guardar el usuario';
                        return rollback(client, done, err, response, status, body);
                    }
                    console.log('select user \n' + selectLastUser);
                    client.query(selectLastUser, function(err, result) {
                        if (err || result.rows === []){ 
                        	body = 'Error al guardar el usuario';
                        	return rollback(client, done, err, response, status, body);
                        }
                        console.log('New User Id\n' + JSON.stringify(result));
                        idUser = result.rows[0]['id'];

                        var interestsInserts = '';
                        interests.forEach(function(interest) {
                            interestsInserts += 'INSERT INTO Interest (idUser, category, value) VALUES(' + idUser + ', \'' + interest.category + '\', \'' + interest.value + '\');\n';
                        });

                        client.query(interestsInserts, function(err, result) {
                            if (err) {
                                body = 'Error al guardar los intereses';
                                return rollback(client, done, err, response, status, body);
                            }
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
        });
    }

    return {
        postNewUser: postNewUser
    }
}();