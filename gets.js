module.exports = function() {
	var pg = require('pg');
	var version =  0.1;

	function addMetadata(response, items){
		console.log(items);
		var count = items.users.length;
		console.log(count);
		var json =  {};
		json.users = items;
		json.metadata =  {
			"version" : version,
			"count" : count
		} 
		console.log(json);
		response.send(json);
	}

	function formatUsers(response, items){
		var users = [];
		items.forEach(function(item){
			console.log('item');
			console.log(item);
			//users.push(item);
		});
		//console.log('users');
		//console.log(users);
		//return users;
		return items;
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
					console.log('rows[0][users]');
					console.log(result.rows[0]['users']);
					return addMetadata(response, formatUsers(result.rows[0]['users']));
				}
			});
		});
	}

	return{
		getAllUsers: getAllUsers
	}
}();
