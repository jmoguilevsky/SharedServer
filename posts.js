module.exports = function() {
	var pg = require('pg');
	var version =  0.1;


	function postNewUser(request,response){
		console.log(request.body);
		/*pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			client.query(query, function(err, result) {
				done();
				if (err){ 
					console.error(err); response.send("Error " + err); 
				} else {
					//response.send(result.rows) ;
					console.log(result);
					console.log('users');
					var users = result.rows[0]['users'];
					console.log(users);
					return addMetadata(response, formatUsers(users));
				}
			});
		});*/
	}

	return{
		postNewUser: postNewUser
	}
}();
