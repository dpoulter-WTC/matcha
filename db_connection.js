exports.create = function() {
	const mysql = require('mysql');
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "camagru",
	  password: "password"
	});
	var sql = "DROP DATABASE if exists `matcha`;"
	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
	  con.query(sql, function (err, result) {
	    console.log("Result: " + result);
	  });
		var sql = "CREATE DATABASE if not exists `matcha` DEFAULT CHARACTER SET utf8;"

		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("Result: " + result);
		});

		var sql ="USE `matcha`;"
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("Result: " + result);
		});

		var sql ="CREATE TABLE if not exists `matcha`.`users` (`id` INT UNIQUE NOT NULL AUTO_INCREMENT,`login` VARCHAR(20) UNIQUE NOT NULL,`passwd` VARCHAR(200) NOT NULL,`email` VARCHAR(100) UNIQUE NOT NULL,`name` VARCHAR(20) NOT NULL,`surname` VARCHAR(20) NOT NULL,`gender` BOOLEAN,`p_m` BOOLEAN,`p_f` BOOLEAN,`bio` VARCHAR(250),`tags` VARCHAR(1000),`token` VARCHAR(10) UNIQUE NOT NULL,`confirmed` BOOLEAN DEFAULT false,PRIMARY KEY (`id`, `login`));"
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("Result: " + result);
		});
	});
}
