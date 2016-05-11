module.exports = function () {
	function queryDeleteUser (idUser) {
		return 'BEGIN ' +
			   'delete from photo where idUser = '+ idUser+ ';' +
			   'delete from location where idUser = '+ idUser+ ';' +
			   'delete from UserInterest where idUser = '+ idUser+ ';' +
			   'delete from UserProfile where id = '+ idUser+ ';' +
			   'END;';
	}

	return{
		queryDeleteUser : queryDeleteUser
	}
}();