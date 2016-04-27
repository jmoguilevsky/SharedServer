module.exports = function() {
    var pg = require('pg');

    var version = 0.1;
    var rollback = function(client, done, error) {
        console.log(error);
        client.query('ROLLBACK', function(err) {
            return done(err);
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
                if (err) rollback(client, done, err);
                console.log('insert user \n' + insertUser);
                client.query(insertUser, function(err) {
                    if (err) {
                        body = 'Error al guardar el usuario';
                        return rollback(client, done, err);
                    }
                    console.log('select user \n' + selectLastUser);
                    client.query(selectLastUser, function(err, result) {
                        if (err || result.rows === []) return rollback(client, done, err);
                        console.log('New User Id\n' + JSON.stringify(result));
                        idUser = result.rows[0]['id'];

                        var interestsInserts = '';
                        interests.forEach(function(interest) {
                            interestsInserts += 'INSERT INTO Interest (idUser, category, value) VALUES(' + idUser + ', \'' + interest.category + '\', \'' + interest.value + '\');\n';
                        });

                        client.query(interestsInserts, function(err, result) {
                            if (err) {
                                body = 'Error al guardar los intereses';
                                return rollback(client, done, err);
                            }
                            console.log('Se guardo ok');
                            client.query('COMMIT', client.end.bind(client));
                            status = 201;
                            body = 'termino todo bien';
                        });
                    });
                });
            });
        });
        response.send(status, body);
    }

    return {
        postNewUser: postNewUser
    }
}();