var express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
var dbConnect = require('./dbConnect');
const app = express();
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));

app.use(fileUpload({
  createParentPath: true
}));

router.post("/send", function (req, res, next) {
  // res.send("API is working properly");
  console.log(req.body.user1)

  dbConnect.query("DELETE FROM `chat` WHERE `user1`= '" + req.body.user2 + "' AND `user2`= '" + req.body.user1 + "'", function (err, rows, fields) {
    if (err) {
      res.status(400).send('Error connecting to database.');
      return
    } else {
      dbConnect.query("INSERT INTO `chat` (`id`, `user1`, `user2`, `message`) VALUES ('', '" + req.body.user1 + "', '" + req.body.user2 + "', '" + req.body.message + "');", function (err, rows, fields) {
        if (err) {
          res.status(300).send('Error connecting to database.');
          return
        } else {
          res.status(200).send('Done');
        }
      })
    }
  })
});

router.post("/recieve", function (req, res, next) {
  // res.send("API is working properly");
  console.log(req.body.user1)

  dbConnect.query("SELECT *  FROM `chat` WHERE `user2` = '" + req.body.user1 + "' AND `user1` = '" + req.body.user2 + "';", function (err, rows, fields) {
    if (err) {
      res.status(300).send('Error connecting to database.');
      return
    } else {
      res.status(200).send(rows);
    }
  })
});


module.exports = router;