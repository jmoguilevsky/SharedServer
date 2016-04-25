module.exports = function() {
	var pg = require('pg');
	var transaction = require('pg-transaction');

	var version =  0.1;


	function postNewUser(request,response){
		console.log('request body');
		console.log(request.body);
		var user = request.body.user;
		var interests = request.body.user.interests;
		
		var insertUser = "INSERT INTO \"USER\"(name, alias, email, latitude, longitude) "+
								"VALUES ('"+user.name + "', '" + user.alias + "', '" + user.email + "'," + user.location.latitude + "," + user.location.longitude +");";
		var selectLastUser = "SELECT id from \"USER\" where email =" + email;
		var idUser = 0;

		var interestsInserts = [];
		interests.forEach(function(interest){
			interestsInserts.push = "INSERT INTO Interest (idUser, category, value) VALUES("+idUser +", "+ interest.category +", "+ interest.value+");";
		});

		console.log(queryInsertUser);
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
			var tx = transaction(client);
			tx.on('error',tx.rollback);
			tx.begin();
			tx.query(insertUser);
			client.query(selectLastUser, function(err, result){
			  if (err) response.send(400, "error al guardar el usuario nuevo");
			  console.log(result.rows[0]['id']); 
			  idUser = result.rows[0]['id'];
			});
			interestsInserts.forEach(function(insert){
				tx.query(insert);
			});
			tx.commit();
			/*client.query(query, function(err, result) {
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
			});*/
		});
		response.send(201, "ok");
	}

	return{
		postNewUser: postNewUser
	}
}();
