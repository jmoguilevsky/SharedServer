module.exports = function() {

    function queryInsertUserWithInterests(user) {
        var newUserVariable = 'idNewUser';
        var interests = '';
        user.interests.forEach(function(interest) {
            interests += queryInsertInterestForUser(interest, newUserVariable);
        });

        return 'DO $$ ' +
            'DECLARE ' + newUserVariable + ' int;' +
            'BEGIN ' +
            queryInsertUser(user) + ' RETURNING id into ' + newUserVariable + ';' +
            queryInsertLocation(user, newUserVariable) +
            interests +
            'END $$;';
    }

    function queryInsertInterest(interest, lastChar) {
        var char = '';
        if (lastChar !== undefined) char = lastChar;
        return 'insert into Interest(category, value) values(\'' + interest.category + '\',\'' + interest.value + '\')'+char;
    }

    function queryInsertInterestForUser(interest, idNewUser) {
        return 'DECLARE idInterest int;' +
            'BEGIN ' +
            'select id from Interest where value =\'' + interest.value + '\' and category = \'' + interest.category + '\' into idInterest;' +
            'IF idInterest is NULL THEN ' +
            queryInsertInterest(interest) + 'returning id into idInterest;' +
            'END IF;' +
            queryInsertUserInterest(idNewUser, 'idInterest') +
            'END;';
    }

    function queryInsertUserInterest(idUser, idInterest) {
        return 'INSERT INTO UserInterest (idUser, idInterest) values (' + idUser + ', ' + idInterest + ');'
    }

    function queryInsertUser(user) {
        return 'INSERT INTO UserProfile(name, alias, email) ' +
            'VALUES (\'' + user.name + '\', \'' + user.alias + '\', \'' + user.email + '\')';
    }

    function queryInsertLocation(user, idUser) {
        return 'INSERT INTO Location(idUser, latitude, longitude) ' +
            'VALUES (' + idUser + ',' + user.location.latitude + ',' + user.location.longitude + ');';
    }

    return {
        insertUserWithInterests: queryInsertUserWithInterests,
        insertUserInterest: queryInsertUserInterest,
        insertInterestForUser: queryInsertInterestForUser,
        insertInterest : queryInsertInterest
    }
}();