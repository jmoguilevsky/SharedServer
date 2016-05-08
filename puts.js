module.exports = function() {
	var querysInserts = require('./querysPosts');

    updateUser = function(user) {
        var queryUpdateUser = queryUpdateUser(user);
        var interests = '';
        user.interests.forEach(function(interest) {
            interests += queryUpdateInterestUser(interest, user.id);
        });
        var user = request.body.user;
        console.log('user\n' + user);
        var interests = request.body.user.interests;
        var query = 'DO $$ '+
        			'DECLARE cant int;'+
    				'BEGIN '+
    				'select id from UserProfile where id = 12313;'+
    				'IF cant IS NULL'+
    				'RAISE NOTICE \'es null\';'+
    				'END IF;'+
    				'END;'+
					'END $$;';

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
                    client.query(querysGets.getUserId(user), function(err, result) {
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

    function queryUpdateLocationUser(location, idUser) {
    	return 'update Location set latitude = \'' + user.name + '\',longitude = \'' + user.alias + '\' where idUser = ' + user.id + ';';
    }

    function queryUpdateInterestUser(interest, idUser) {
    	
    }

    function queryUpdateUser(user) {
        return 'update UserProfile set name = \'' + user.name + '\',alias = \'' + user.alias + '\' where id = ' + user.id + ' and email=\'' + user.email + '\';';
    }

    return {
        putUser: updateUser
    }
}();