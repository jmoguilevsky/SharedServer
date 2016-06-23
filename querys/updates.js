var querysInserts = require('./inserts');

module.exports = function () {

    function queryUpdateUserProfile(user) {
        return 'update UserProfile set (name, alias, sex, age) = (\'' + user.name + '\',\'' + user.alias + '\',\'' + user.sex + '\','+ user.age +') where id = ' + user.id + ' and email =\'' + user.email + '\';'
    }

    function queryUpdateLocation(user) {
        return 'update Location set (latitude, longitude) =  (' + user.location.latitude + ',' + user.location.longitude + ') where idUser = ' + user.id + ';';
    }

    function queryUpdatePhoto(idUser, encodedString) {
        return 'update Photo set (encodedString) =  (\'' + encodedString + '\') where idUser = ' + idUser + ';';
    }

    function queryUpdateUser(user) {
        var interests = '';
        user.interests.forEach(function(interest) {
            interests += querysInserts.insertInterestForUser(interest, user.id);
        });

        return 'DO $$ ' +
            'DECLARE cant int;' +
            'BEGIN ' +
            'select id into cant from UserProfile where id = ' + user.id + ' and email = \'' + user.email + '\';' +
            'IF cant IS NULL THEN ' +
            'RAISE EXCEPTION \'user doesnt exist\';' +
            'END IF; ' +
            queryUpdateUserProfile(user) +
            queryUpdateLocation(user) +
            queryUpdatePhoto(user.id, user.photo_profile) +
            'delete from UserInterest where idUser = ' + user.id + ';' +
            interests +
            'END $$;';
    }

    return{
        queryUpdateUser : queryUpdateUser,
        queryUpdatePhoto : queryUpdatePhoto
    }
}();