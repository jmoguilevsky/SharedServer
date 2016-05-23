module.exports = function() {
    var pg = require('pg');
    var version = 0.1;

    function login(request, response) {
        console.log(request.body);
        query = 'select * from UserProfile';
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    //response.send(result.rows) ;
                    console.log(result);
                    console.log('user');
                    response.status(200).send('ok');
                }
            });
        });
    }

    return {
        login: login
    }
}();