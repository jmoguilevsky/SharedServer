module.exports = function() {
    var pg = require('pg');

    var version = 0.1;
    var rollback = function(client, done) {
        client.query('ROLLBACK', function(err) {
            return done(err);
        });
    };


    function postNewUser(request, response) {
        console.log('request body');
        console.log(request.body);
        var user = request.body.user;
        var interests = request.body.user.interests;

        var insertUser = 'INSERT INTO \"USER\"(name, alias, email, latitude, longitude) ' +
            'VALUES ('
        ' + 'user.name' + '
        ', '
        ' + 'user.alias' + '
        ', '
        ' + 'user.email' + '
        ',' + user.location.latitude + ',' + user.location.longitude + ');';
        var selectLastUser = 'SELECT id from \"USER\" where email =' + user.email;
        var idUser = 0;

        var interestsInserts = '';


        console.log(queryInsertUser);
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('BEGIN', function(err) {
                if (err) return rollback(client, done);
                client.query(insertUser, function(err) {
                    if (err) return rollback(client, done);
                    client.query(selectLastUser, function(err, result) {
                        if (err) return rollback(client, done);
                        console.log('New User Id' + result.rows[0]['id']);
                        idUser = result.rows[0]['id'];
                        interests.forEach(function(interest) {
                            interestsInserts += 'INSERT INTO Interest (idUser, category, value) VALUES(' + idUser + ', ' + interest.category + ', ' + interest.value + ');\n';
                        });
                        client.query(interestsInserts, function(err, result) {
                            if (err) return rollback(client, done);
                            console.log('Se guardo ok');
                            response.send(201, 'ok');
                        });
                    });
                });
            });



            /*client.query(query, function(err, result) {
            	done();
            	if (err){ 
            		console.error(err); response.send("Error ' + err); 
            	} else {
            		//response.send(result.rows) ;
            		console.log(result);
            		console.log('users');
            		var users = result.rows[0]['users'];
            		console.log(users);
            		return addMetadata(response, formatUsers(users));
            	}
            });*/
        });
        response.send(201, 'ok');
    }

    return {
        postNewUser: postNewUser
    }
}();