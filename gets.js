module.exports = function() {
    var pg = require('pg');
    var version = 0.1;
    var querys = require('./querysGets.js');

    function addMetadataUser(response, item) {
        var json = {};
        json.user = item;
        json.metadata = {
            "version": version,
        }
        console.log(json);
        response.send(json);
    }

    function addMetadataUsers(response, items) {
        console.log(items);
        var count = items.length;
        console.log(count);
        var json = {};
        json.users = items;
        json.metadata = {
            "version": version,
            "count": count
        }
        console.log(json);
        response.send(json);
    }

    function formatUser(user) {
        return {
            user: user
        }
    }

    function formatUsers(items) {
        var users = [];
        items.forEach(function(item) {
            users.push(
                formatUser(item)
            );
        });
        //console.log('users');
        //console.log(users);
        //return users;
        return users;
    }

    function getAllUsers(request, response) {
        //var query = "SELECT array_to_json(array_agg(row_to_json(users_json))) as users from (select *, (SELECT array_to_json(array_agg(row_to_json(interests))) from (select category, value from Interest where idUser = id) interests ) AS Interests from \"USER\") as users_json;";
        query = querys.getAllUsers();
        console.log(query);
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    //response.send(result.rows) ;
                    console.log(result);
                    console.log('users');
                    var users = result.rows[0]['users'];
                    console.log(users);
                    return addMetadataUsers(response, formatUsers(users));
                }
            });
        });
    }

    function getUser(request, response) {
        //var query = "SELECT array_to_json(array_agg(row_to_json(users_json))) as users from (select *, (SELECT array_to_json(array_agg(row_to_json(interests))) from (select category, value from Interest where idUser = id) interests ) AS Interests from \"USER\") as users_json;";
        var idUser = request.params.idUser;
        query = querys.getUser(idUser);

        console.log(query);
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
                    var user = result.rows[0];
                    console.log(user);
                    return addMetadataUser(response, formatUser(user));
                }
            });
        });
    }

    return {
        getAllUsers: getAllUsers,
        getUser: getUser
    }
}();