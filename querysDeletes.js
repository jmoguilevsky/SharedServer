module.exports = function () {
	function queryDeleteUser (idUser) {
		return 'delete from photo where idUser = '+ idUser+ ';' +
			   'delete from location where idUser = '+ idUser+ ';' +
			   'delete from UserInterest where idUser = '+ idUser+ ';' +
			   'delete from UserProfile where idUser = '+ idUser+ ';';
	}

	return{
		queryDeleteUser : queryDeleteUser
	}
}();