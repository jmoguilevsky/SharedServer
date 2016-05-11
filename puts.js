module.exports = function() {
    var pg = require('pg');
    var querysUpdate =require('./querysUpdates.js');

    updateUser = function(request, response) {
        var user = request.body.user;
        console.log('user\n' + user);
        var query = querysUpdate.queryUpdateUser(user);
        console.log(query);
        //var selectInterest = 'SELECT id from UserProfile where email = \'' + user.email + '\' ;';

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err) {
                if (err) {
                    body = {
                        error: 'No se pudo guardar el usuario',
                        metadata: request.body.metadata
                    };
                    response.status(400).send(body);
                } else {
                    console.log('Se updateo');
                    body = {};
                    body.user = user;
                    body.metadata = request.body.metadata;
                    response.status(201).send(body);
                }
            });
        });
    }

    updatePhoto = function(request, response) {
        var idUser = request.params.id;
        console.log('idUser\n' + idUser);
        var query = querysUpdate.queryUpdatePhoto(idUser, request.body.photo);
        console.log(query);
        //var selectInterest = 'SELECT id from UserProfile where email = \'' + user.email + '\' ;';

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err) {
                if (err) {
                    body = {
                        error: 'No se pudo guardar el usuario',
                        metadata: request.body.metadata
                    };
                    response.status(400).send(body);
                } else {
                    console.log('Se updateo');
                    body = {};
                    body.user = user;
                    body.metadata = request.body.metadata;
                    response.status(201).send(body);
                }
            });
        });
    }

    return {
        putUser: updateUser,
        putPhoto : updatePhoto
    }
}();