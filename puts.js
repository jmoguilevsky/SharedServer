module.exports = function() {
    var querysInserts = require('./querysInserts');
    var pg = require('pg');

    function queryUpdateUserProfile(user) {
        return 'update UserProfile set (name, alias) = (\'' + user.name + '\',\'' + user.alias + '\') where id = ' + user.id + ' and email =\'' + user.email + '\';'
    }

    function queryUpdateLocation(user) {
        return 'update Location set (latitude, longitude) =  (' + user.latitude + ',' + user.longitude + ') where idUser = ' + user.id + ';';
    }

    function queryUpdateUser(user) {
        var interest = '';
        user.interests.forEach(function(interest) {
            interests += querysInserts.insertInterestForUser(interest, newUserVariable);
        });

        return 'DO $$ ' +
            'DECLARE cant int;' +
            'BEGIN ' +
            'select id into cant from UserProfile where id = ' + user.id + ' and email = \'' + user.email + '\';' +
            'IF cant IS NULL THEN ' +
            'RAISE EXCEPTION \'user doesnt exist\';' +
            'END IF; ' +
            quertUpdateUserProfile(user) +
            queryUpdateLocation(user) +
            'delete from UserInterest where idUser = ' + user.id + ';' +
            interests +
            'END $$;';
    }

    updateUser = function(request, response) {
        //var queryUpdateUser = queryUpdateUser(user);
        /*var interests = '';
        user.interests.forEach(function(interest) {
            interests += queryUpdateInterestUser(interest, user.id);
        });*/
        var user = request.body.user;
        console.log('user\n' + user);
        var query = queryUpdateUser(user);

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

    function queryUpdateInterestUser(interest, idUser) {

    }

    return {
        putUser: updateUser
    }
}();