var deleteQuerys = require('../querys/deletes.js');

module.exports = function() {
    var pg = require('pg');

    function deleteUser(request, response) {
        var idUser = request.params.idUser;
        console.log('elimino ' + idUser);

        var query = deleteQuerys.queryDeleteUser(idUser);
        console.log(query);

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err) {
                if (err) {
                    body = {
                        error: 'No se pudo eliminar el usuario',
                        metadata: request.body.metadata
                    };
                    response.status(400).send(body);
                } else {
                    console.log('delete ok');
                    body = {};
                    body.idUser = idUser;
                    body.metadata = request.body.metadata;
                    response.status(200).send(body);
                }
            });
        });
    }

    return {
        deleteUser: deleteUser
    }
}();