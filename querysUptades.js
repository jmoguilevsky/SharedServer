module.exports = function () {
    var querysInserts = require('./querysInserts');


    function queryUpdateUserProfile(user) {
        return 'update UserProfile set (name, alias) = (\'' + user.name + '\',\'' + user.alias + '\') where id = ' + user.id + ' and email =\'' + user.email + '\';'
    }

    function queryUpdateLocation(user) {
        return 'update Location set (latitude, longitude) =  (' + user.location.latitude + ',' + user.location.longitude + ') where idUser = ' + user.id + ';';
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
            'delete from UserInterest where idUser = ' + user.id + ';' +
            interests +
            'END $$;';
    }
}();