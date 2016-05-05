module.exports = function() {
    var pg = require('pg');
    var version = 0.1;
    var querys = require('./querysGets.js');

    function addMetadata(response, items) {
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

    function formatUsers(items) {
        var users = [];
        items.forEach(function(item) {
            users.push({
                user: item
            });
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
                    return addMetadata(response, formatUsers(users));
                }
            });
        });
    }

    return {
        getAllUsers: getAllUsers
    }
}();