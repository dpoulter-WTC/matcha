var express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
var mysql = require('mysql')
const app = express();
var nodemailer = require('nodemailer');
var tools = require('../tools');
var dbConnect = require('./dbConnect');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'matchaproject1@gmail.com',
    pass: 'M@tchapass123'
  }
});

app.use(bodyParser.urlencoded({
  extended: true
}));

router.post("/login", function (req, res, next) {
  // res.send("API is working properly");
  dbConnect.query("SELECT * from user_login where `username`= '" + req.body.username + "'", function (err, rows, fields) {
    if (err) {
      res.status(500).send('Error connecting to database.');
      return
    } else {
      if (rows.length > 0) {
        res.status(200).send(rows[0]);
      } else {
        res.status(200).send({ password: "1" });
      }
    }
  })
});

router.post('/register', function (req, res) {
  const validation = tools.makeid(10);
  dbConnect.query("INSERT INTO `user_login` (`id`, `email`, `password`, `first_name`, `last_name`, `username`, `verfication_code`) VALUES ('', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.firstName + "', '" + req.body.lastName + "', '" + req.body.username + "', '" + validation + "');", function (err, rows, fields) {
    if (err) {
      if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
        res.status(500).send({ res: 'Username or Email is already in use' });
        return;
      }
      else {
        res.status(500).send('Error connecting to database.');
        return;
      }
    } else {
      const link = req.protocol + '://' + req.get('host').slice(0, -5) + ':3000/verify?id=' + validation;
      const messagebody = 'Hello ' + req.body.firstName + 'Please verify your account using the following link:' + link + ' Regards,The Matcha Team';
      var mailOptions = {
        from: 'matchaproject1@gmail.com',
        to: req.body.email,
        subject: 'Please verify your Matcha account',
        text: messagebody,
        html: 'Hello ' + req.body.firstName + '<br /><br /> Please verify your account using the following link:<br /> <a href="' + link + '">' + link + '</a> <br /><br />Regards,<br />The Matcha Team'
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  })
});

router.post('/verify', function (req, res) {
  dbConnect.query("UPDATE `user_login` SET `verified` = '1' WHERE `user_login`.`verfication_code` = '" + req.body.id + "';", function (err, rows, fields) {
    if (err) {

      if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
        console.log('Here you can handle duplication')
      }
      else {
        console.log('Other error in the query')
      }

    } else {
      console.log('No error in the query')
    }
  })
  res.end("yes");
});

router.post('/forgot', function (req, res) {
  dbConnect.query("UPDATE `user_login` SET `password` = '" + req.body.tempPassHash + "' WHERE `user_login`.`email` = '" + req.body.email + "';", function (err, rows, fields) {
    if (err) {
      res.status(500).send('Error connecting to database.');
      return;
    } else {
      if (rows > 0) {
        const messagebody = 'Hello You have requested a password change. Your new password is:' + req.body.tempPass + ' Regards,The Matcha Team';
        var mailOptions = {
          from: 'matchaproject1@gmail.com',
          to: req.body.email,
          subject: 'Password Reset',
          text: messagebody,
          html: 'Hello <br /><br />You have requested a password change. Your new password is:<br />' + req.body.tempPass + '<br /><br />Regards,<br />The Matcha Team'
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    }
  })
  res.end("yes");
});

module.exports = router;