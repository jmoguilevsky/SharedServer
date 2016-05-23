module.exports = function() {
    var pg = require('pg');
    var version = 0.1;

    function login(request, response) {
        console.log(request.body);
        var email = request.body.user.email;
        var password = request.body.user.password;
        query = 'select * from admin where email = \''+email+'\' and password = \''+password+'\';';
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    //response.send(result.rows) ;
                    console.log('count ' + result.rowCount);
                    if (result.rowCount === 0) {
                        response.status(401).send('el usuario no existe');    
                    }else{
                        response.status(200).send('se logueo: '+ result.rows[0]);
                    }
                }
            });
        });
    }

    return {
        login: login
    }
}();