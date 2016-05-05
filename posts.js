module.exports = function() {
    var pg = require('pg');
    var version = 0.1;

    function queryInsertUserWithInterests(user) {
        var newUserVariable = 'idNewUser';
        var interests = '';
        user.interests.forEach(function(interest) {
            interests += queryInsertInterestForUser(interest, newUserVariable);
        })

        return 'DO $$' +
            'DECLARE ' + newUserVariable + ' int;' +
            'begin' +
            queryInsertUser(user) + ' returning id into ' + newUserVariable + ';' +
            interests +
            'END $$;';
    }

    function querSelectInterest(interest) {
        return 'select id from Interest where value =\'' + interest.value + '\' and category = \'' + interest.category + '\';'
    }

    function queryInsertInterestForUser(interest, idNewUser) {
		return 'DECLARE idInterest int;'+
		'BEGIN'+
		'select id from Interest where value =\'' + interest.value + '\' and category = \'' + interest.category + '\' into idInterest;'+
		'IF idInterest is NULL THEN'+
			'insert into Interest(category, value) values(\'' + interest.category + '\',\'' + interest.value + '\') returning id into idInterest;' +
		'END IF;'+
		'insert into UserInterest (idUser,idInterest) values (' + idNewUser + ', idInterest);' +
		'END;';
    }

    function queryInsertUserInterest(idUser, idInterest) {
        return 'INSERT INTO UserInterest (idUser, idInterest) values (' + idUser + ', ' + idInterest + ');'
    }

    function queryInsertUser(user) {
        return 'INSERT INTO UserProfile(name, alias, email, latitude, longitude) ' +
            'VALUES (\'' + user.name + '\', \'' + user.alias + '\', \'' + user.email + '\',' +
            user.location.latitude + ',' + user.location.longitude + ')';
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
                client.query(queryInsertInterestForUser(interest, idUser), function(err) {
                    if (err) {
                        console.log('the interest didn\'t exist, i save it');
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

        var body = 'Error';
        //console.log(request.body);
        var user = request.body.user;
        console.log('user\n' + user);
        var interests = request.body.user.interests;
        var query = queryInsertInterestForUser(user);
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
                }
                console.log('Se guardo ok');
                user.id = idUser;

                body = {};
                body.user = user;
                body.metadata = request.body.metadata;
                response.status(201).send(body);
            });
        });
    }

    return {
        postNewUser: postNewUser
    }
}();