const express = require('express');
const bodyParser = require('body-parser');
const people = require('./people.json');
var nodemailer = require('nodemailer');
const mysql = require('mysql');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

var red = "❌ \x1b[1m \x1b[31m";
var green = "✅ \x1b[1m \x1b[32m";

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'matchaproject1@gmail.com',
		pass: 'M@tchapass123'
	}
});

var con = mysql.createConnection({
	host: "localhost",
	user: "camagru",
	password: "password"
});

con.connect(function (err) {
	if (err) {
		console.log(err);
	}
	console.log(green + " CONNECTED TO MySQL \x1b[33m PORT: 3360 \x1b[0m");
});

const urlencodedParser = bodyParser.urlencoded({
	extended: false
});

function getMySQLConnection() {
	return mysql.createConnection({
		host     : 'localhost',
		user     : 'camagru',
		password : 'password',
		database : 'matcha'
	});
}

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Homepage',
		people: people.profiles
	});
});

const server = app.listen(70, () => {
	console.log(`Server running → PORT ${server.address().port}`);
	console.log(server.address());
});

app.get('/chat', (req, res) => {
	res.render('chat')
})

const io = require("socket.io")(server);

io.on('connection', (socket) => {
	console.log('New user connected')

	//default username
	socket.username = "Anonymous"

	//listen on change_username
	socket.on('change_username', (data) => {
		socket.username = data.username
	})

	//listen on new_message
	socket.on('new_message', (data) => {
		//broadcast the new message
		io.sockets.emit('new_message', {message : data.message, username : socket.username});
	})

	//listen on typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', {username : socket.username})
	})
})


app.post('/login', urlencodedParser, (req, res) => {
	console.log(req.body);
	con.query('SELECT * FROM `matcha`.`users` WHERE `email` = ?', [req.body.email], (err, results, fields) => {
		if (err) {
			console.log(red + err + " \x1b[0m");
			return;
		}
		if (results.length == 1) {
			console.log(results[0].passwd);
			bcrypt.compare(req.body.password, results[0].passwd, (err, ress) => {
				if (ress == true) {
					res.redirect("/");
				} else {
					res.redirect("/login");
				}
			});
		} else {
			res.redirect("/login");
		}
	});
});

app.get('/login', (req, res) => {
	res.render('login', {
		title: 'Login',
	});
});

app.post('/register', urlencodedParser, (req, res, next) => {
	console.log(req.body);
	con.query('SELECT * FROM `matcha`.`users` WHERE `email` = ?', [req.body.email], (err, results, fields) => {
		if (err) {
			console.log(red + err + " \x1b[0m");
			return;
		}
		if (results.length == 0) {
			con.query('SELECT * FROM `matcha`.`users` WHERE `login` = ?', [req.body.username], (err, results, fields) => {
				if (err) {
					console.log(red + err + " \x1b[0m");
					return;
				}
				if (results.length == 0) {
					let r = Math.random().toString(36).substring(2);

					var hash = bcrypt.hashSync(req.body.password, saltRounds);
					con.query('INSERT INTO `matcha`.`users` (`login`, `passwd`, `email`, `name`, `surname`, `gender`, `p_m`, `p_f`, `token`) VALUES (?,?,?,?,"test","1","1","1",?)', [req.body.username, hash, req.body.email, req.body.name, r]);
					var emailcont = '<h1>Thanks for joining Matcha!</h1></br><p>To complete your your registration, please click the following link.</p><a href="'+request.getServerName()+'/token.php">Verify Account</a></br><p>All the best,</p><p>The Matcha Team</p>';
					console.log(emailcont);
					var mailOptions = {
						from: 'matchaproject1@gmail.com',
						to: req.body.email,
						subject: 'Sending Email using Node.js',
						html: emailcont
					};

					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});
				} else {
					console.log(red + 'USERNAME EXISTS IN DATABASE \x1b[0m');
				}
			});
		} else {
			console.log(red + 'EMAIL EXISTS IN DATABASE \x1b[0m');
		}
	});
	res.redirect("/");
});

app.get('/register', (req, res) => {
	res.render('register', {
		title: 'Register',
	});
});

app.get('/test', (req, res) => {

	var personList = [];
	var connection = getMySQLConnection();
	connection.connect();

	connection.query('SELECT * FROM users', function(err, rows, fields) {
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
		} else {
			for (var i = 0; i < rows.length; i++) {
				var person = {
					'name':rows[i].name,
					'surname':rows[i].surname,
					'gender':rows[i].gender,
					'passwd':rows[i].passwd
				}
				personList.push(person);
			}
			res.render('test', {
				title: 'Test',
				"personList": personList
			});
		}
	});
});

app.get('/profile', (req, res) => {
	const person = people.profiles.find(p => p.id === req.query.id);
	res.render('profile', {
		title: `About ${person.firstname} ${person.lastname}`,
		person,
	});
});

app.get('/config', (req, res) => {
	const db = require('./db_connection.js');
	db.create();
	res.redirect("/");
});
