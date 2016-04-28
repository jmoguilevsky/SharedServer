module.exports = function() {
    var getAllUsers = function() {
        return "SELECT array_to_json(array_agg(row_to_json(users_json))) as users from (select *, (SELECT array_to_json(array_agg(row_to_json(interests))) from (select category, value from Interest where idUser = id) interests ) AS Interests from \"USER\") as users_json;";
    }

    return {
        getAllUsers: getAllUsers
    }
}();