module.exports = function() {
	var pg = require('pg');
	var version =  0.1;

	function addMetadata(response, result){
		var count = result.rows.length;
		var jsonToReturn = result.rows;
		jsonToReturn.metadata = {
			"version" : version,
			 "count":count
		}
		response.send(jsonToReturn);
	}

	function getAllUsers(request,response){
		var query = "select array_to_json(array_agg(row_to_json(rows))) from ( select * from usuario) rows;";
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query(query, function(err, result) {
				done();
				if (err){ 
					console.error(err); response.send("Error " + err); 
				} else {
					//response.send(result.rows) ;
					return addMetadata(response, result);
				}
			});
		});
	}

	return{
		getAllUsers: getAllUsers
	}
}();
