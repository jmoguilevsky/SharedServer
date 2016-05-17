module.exports = function() {
    var pg = require('pg');
    var version = 0.1;
    var querys = require('./querysGets.js');

    function addMetadataUser(response, item) {
        var json = item;
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

    function addMetadataInterests(response, items) {
        console.log(items);
        var count = items.length;
        console.log(count);
        var json = {};
        json.interests = items;
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

    function formatInterests(interests) {
        return interests;
    }

    function formatUsers(items) {
        var users = [];
        items.forEach(function(item) {
            users.push(
                formatUser(item)
                );
        });
        return users;
    }

    function getAllUsers(request, response) {
        query = querys.getAllUsers();
        console.log(query);
        return getAllItemsInTable(request, response, query, 'users', 'users', addMetadataUsers, formatUsers);
    }

    function getUser(request, response) {
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

    function getAllInterests(request, response) {
        query = querys.getAllInterests();
        console.log(query);
        return getAllItemsInTable(request, response, query, 'interests', 'interests', addMetadataInterests, formatInterests);
    }

    function getAllItemsInTable(request, response, query, logMessage, resultProperty, addMetadataFunction, formatData) {
        //var query = "SELECT array_to_json(array_agg(row_to_json(users_json))) as users from (select *, (SELECT array_to_json(array_agg(row_to_json(interests))) from (select category, value from Interest where idUser = id) interests ) AS Interests from \"USER\") as users_json;";
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    //response.send(result.rows) ;
                    console.log(logMessage+'\n'+result);
                    var items = result.rows[0][resultProperty];
                    console.log(items);
                    return addMetadataFunction(response, formatData(items));
                }
            });
        });
    }

    function getUserPhoto(request, response) {
        var idUser = request.params.idUser;
        query = querys.getUserPhoto(idUser);

        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query(query, function(err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.status(400).send("Error " + err);
                } else {
                    console.log('result '+'\n'+JSON.stringify(result));
                    if (result.rows.rowCount === 0) {
                        response.status(200).send('');
                    }else{
                        console.log(result.rows[0]);
                        var photo = result.rows[0].encodedstring;
                        console.log(photo);
                        response.status(200).send(photo);
                    }
                }
            });
        });
    }

    function getUserPhotoDecoded(request, response) {
        var encodedstring = getUserPhoto(request, response);
        response.return("data:image; base64, "+encodedstring);
    }

    return {
        getAllUsers: getAllUsers,
        getUser: getUser,
        getAllInterests : getAllInterests,
        getUserPhoto : getUserPhoto,
        getUserPhotoDecoded: getUserPhotoDecoded
    }
}();