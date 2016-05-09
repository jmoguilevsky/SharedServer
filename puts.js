module.exports = function() {
    var pg = require('pg');
    var querysUpdate =require('./querysUpdate');

    updateUser = function(request, response) {
        //var queryUpdateUser = queryUpdateUser(user);
        /*var interests = '';
        user.interests.forEach(function(interest) {
            interests += queryUpdateInterestUser(interest, user.id);
        });*/
        var user = request.body.user;
        console.log('user\n' + user);
        var query = querysUpdate.queryUpdateUser(user);

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
                    body = {};
                    body.user = user;
                    body.metadata = request.body.metadata;
                    response.status(201).send(body);
                }
            });
        });
    }

    function queryUpdateLocationUser(location, idUser) {
        return 'update Location set latitude = \'' + user.name + '\',longitude = \'' + user.alias + '\' where idUser = ' + user.id + ';';
    }
    return {
        putUser: updateUser
    }
}();