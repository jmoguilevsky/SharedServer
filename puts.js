module.exports = function() {
    var pg = require('pg');
    var updateQuerys =require('./querysUpdates.js');

    updateUser = function(request, response) {
        var user = request.body.user;
        console.log('update the profile of the user\n' + user);
        var query = updateQuerys.queryUpdateUser(user);
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
                    console.log('Update ok');
                    body = {};
                    body.user = user;
                    body.metadata = request.body.metadata;
                    response.status(201).send(body);
                }
            });
        });
    }

    updatePhoto = function(request, response) {
        var idUser = request.params.idUser;
        console.log('update photo of ' + idUser);
        var query = updateQuerys.queryUpdatePhoto(idUser, request.body.photo);
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
                    console.log('Update ok');
                    body = {};
                    body.photo = request.body.photo;
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