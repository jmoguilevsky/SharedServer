module.exports = function() {
	var pg = require('pg');
	var version =  0.1;

	function addMetadata(response, rows){
		console.log(rows);
		var count = rows.length;
		console.log(count);

		rows.metadata = {
			"version" : version,
			"count" : count
		}
		var newObject =  [];
		newObject.users = rows.users;
		newObject.metadata = rows.metadata;
		console.log(newObject);
		response.send(rows.metadata);
	}

	function getAllUsers(request,response){
		var query = "select array_to_json(array_agg(row_to_json(row))) as users from ( select * from usuario) as row;";
		console.log(query);
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query(query, function(err, result) {
				done();
				if (err){ 
					console.error(err); response.send("Error " + err); 
				} else {
					//response.send(result.rows) ;
					return addMetadata(response, result.rows);
				}
			});
		});
	}

	return{
		getAllUsers: getAllUsers
	}
}();
