module.exports = function() {
    function getAllUsers() {
        return "SELECT array_to_json(array_agg(row_to_json(users_json))) as users from  (select id as id, name, alias, email, sex, age, 'http://enigmatic-depths-58073.herokuapp.com/users/' || id || '/photo 'as photo_profile,  (SELECT row_to_json(l) from  (select latitude, longitude from Location where Location.idUser = UserProfile.id) l ) AS location, (SELECT array_to_json(array_agg(row_to_json(interests))) from  (select category, value from Interest, UserInterest where UserInterest.idInterest = Interest.id and UserInterest.idUser = UserProfile.id) interests ) AS Interests from UserProfile order by id) as users_json;";
    }

    function getAllUsersWithPhotos() {
        return "SELECT array_to_json(array_agg(row_to_json(users_json))) as users from  (select id as userId, name, alias, email, sex, age, 'http://enigmatic-depths-58073.herokuapp.com/users/' || id || '/photo 'as photo_profile_link, (select encodedString from Photo where photo.idUser = UserProfile.id) as photo_profile_encodedString, (SELECT row_to_json(l) from  (select latitude, longitude from Location where Location.idUser = UserProfile.id) l ) AS location, (SELECT array_to_json(array_agg(row_to_json(interests))) from  (select category, value from Interest, UserInterest where UserInterest.idInterest = Interest.id and UserInterest.idUser = UserProfile.id) interests ) AS Interests from UserProfile order by id) as users_json;";
    }

    function getUser(idUser) {
        return 'select *, (select encodedString from Photo where  Photo.idUser = UserProfile.id) as photo_profile, (SELECT row_to_json(l) from  (select latitude, longitude from Location where Location.idUser = UserProfile.id) l ) AS location, (SELECT array_to_json(array_agg(row_to_json(interests))) from (select category, value from Interest, UserInterest where UserInterest.idInterest = Interest.id and UserInterest.idUser = UserProfile.id) interests ) AS Interests from UserProfile ' +
            'where id =' + idUser + ';';
    }

    function selectInterest(interest) {
        return 'select id from Interest where value =\'' + interest.value + '\' and category = \'' + interest.category + '\';'
    }

    function getUserId(user) {
        return 'SELECT id from UserProfile where email = \'' + user.email + '\' ;';
    }

    function getAllInterests() {
        return 'select array_to_json(array_agg(row_to_json(interest_json))) as Interests from (select category, value from Interest) interest_json;';
    }

    function getUserPhoto(idUser) {
        return 'SELECT encodedString from photo where idUser =  '+ idUser + ';';
    }

    return {
        getAllUsers: getAllUsers,
        getAllUsersWithPhotos: getAllUsersWithPhotos,
        getInterest: selectInterest,
        getUserId: getUserId,
        getUser: getUser,
        getAllInterests: getAllInterests,
        getUserPhoto : getUserPhoto
    }
}();