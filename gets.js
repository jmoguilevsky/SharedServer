module.exports = function() {
	var pg = require('pg');

	function getAllUsers(request,response){
		var query = "select row_to_json(usuario) from usuario;";
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query(query, function(err, result) {
				done();
				if (err){ 
					console.error(err); response.send("Error " + err); 
				} else {
					response.send(result.rows) ;
				}
			});
		});
	}

	return{
		getAllUsers: getAllUsers
	}
}();
