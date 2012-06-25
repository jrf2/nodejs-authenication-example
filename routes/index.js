var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var mysql = require("mysql");
var dbname = config.database.dbname;
var bcrypt = require('bcrypt');

function createClient() {
	return mysql.createClient({
		host: config.database.host,
		port: config.database.port,
		user: config.database.user,
		password: config.database.password
	});
}

function selectDatabase(client) {
	client.query("USE " + dbname, function(err) {
		if (err) {
			console.log("Unable to select database");
			return;
		}
	});
}

function checkAuth(request) {
	return request.session.username ? request.session.username : "guest";
}

exports.index = function(request, response) {
	console.log(request.session);
	response.render('index', { title: "Homepage", username: checkAuth(request), _csrf: request.session_csrf });
}

exports.loginGet = function(request, response) {
	var post = request.body;
	response.render('login', { title: "Login", message: ""});
}

exports.loginPost = function(request, response) {
	var post = request.body;
	var client = createClient();

	client.query("CREATE DATABASE IF NOT EXISTS " + dbname, function(err) {
		if (err) {
			console.log("unable to create db: " + err);
			return;
		}

		selectDatabase(client);

		client.query("SELECT * FROM user WHERE username = " + client.escape(post.username), function(err, rows) {
			if (rows.length > 0) {
				if (bcrypt.compareSync(post.password, rows[0].password)) {
					request.session.username = post.username;
					response.redirect('/');
				} else {
					response.render('login', { title: "Login", 
						message: "Bad username or password"});
				}
			} else {
				response.render('login', { title: "Login", 
						message: "Bad username or password"});
			}
		});
		client.end();
	});
}

exports.registerGet = function(request, response) {
	response.render('register', { title: "Register", message: ""});
}

exports.registerPost = function(request, response) {
	var post = request.body;
	var client = createClient();

	client.query("CREATE DATABASE IF NOT EXISTS " + dbname, function(err) {
		if (err) {
			console.log("unable to create db: " + err);
			return;
		}

		selectDatabase(client);
		
		client.query("SELECT * FROM user WHERE username = " + client.escape(post.username), function(err, rows) {
			if (rows.length > 0) {
				response.render('login', { title: "Login", 
					message: "User Already Exists"});
			}
		});
		
		var hash = bcrypt.hashSync(post.password, bcrypt.genSaltSync(10));
		client.query("INSERT INTO user" +
			"(username, password) VALUES"+
			'("'+post.username+'","'+hash+'")', function(err) {
			if (err) {
				console.log("Error inserting stuff");
				return;
			}
			request.session.username = post.username;
			response.redirect('/');
		});
		
		client.end();
	});
}

exports.logout = function(request, response) {
	request.session.username = "guest";
	response.redirect('/');
}

