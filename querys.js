module.exports = function() {
    function getAllUsers() {
        return "SELECT array_to_json(array_agg(row_to_json(users_json))) as users from (select *, (SELECT array_to_json(array_agg(row_to_json(interests))) from (select category, value from Interest, UserInterest where UserInterest.idInterest = Interest.id and UserInterest.idUser = UserProfile.id) interests ) AS Interests from UserProfile) as users_json;";
    }

    return {
        getAllUsers: getAllUsers
    }
}();