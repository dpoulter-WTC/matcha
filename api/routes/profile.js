var express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
var dbConnect = require('./dbConnect');
const app = express();
const multer = require("multer");
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

router.post("/profileinfo", function (req, res, next) {
  // res.send("API is working properly");
  console.log(req.body.username)
  dbConnect.query("SELECT * from user_login where `username`= '" + req.body.username + "'", function (err, rows, fields) {
    if (err) {
      res.status(100).send('Error connecting to database.');
      return
    } else {
      if (rows.length > 0) {
        console.log(rows[0])
        res.status(200).send(rows[0]);
      } else {
        res.status(500).send('Username or Password incorrect');
      }
    }
  })
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images/');
   },
  filename: function (req, file, cb) {
    console.log(req.body)
      cb(null , file.originalname);
  }
});

var upload = multer({ storage: storage })



router.post("/upload", upload.single('picture'), function  (req, res) {
  try {
    if (!req.file) {
      res.status(300).send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      dbConnect.query("SELECT * from images where `username`= '" + req.body.username + "' AND `img-pos` = '" + req.body.img_pos + "'", function (err, rows, fields) {
        if (err) {
          res.status(100).send('Error connecting to database.');
          return
        } else {
          if (rows.length > 0) {
            dbConnect.query("UPDATE `images` SET `link` = '"+req.file.filename+"' WHERE `id` = '" + rows[0].ID + "';", function (err, rows2, fields) {
              if (err) {
                console.log(err)
                res.status(100).send('Error connecting to database.');
                return
              } else {
                res.status(200).send({ error: "Added to veiwed" });
              }
            })
          } else {
            dbConnect.query("INSERT INTO `images` (`id`, `username`, `img-pos`, `link`) VALUES ('', '" + req.body.username + "', '" + req.body.img_pos + "', '"+req.file.filename+"');", function (err, rows, fields) {
              if (err) {
                console.log(err)
                res.status(100).send('Error connecting to database.');
                return
              } else {
                res.status(200).send({ error: "Added file to username" });
              }
            })
          }
        }
      })

    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/checklike", function (req, res, next) {
  dbConnect.query("SELECT * from likes where `username`= '" + req.body.username + "' AND `profile` = '" + req.body.profile + "'", function (err, rows, fields) {
    if (err) {
      res.status(100).send('Error connecting to database.');
      return
    } else {
      if (rows.length > 0) {
        console.log(rows[0])
        res.status(200).send(rows[0]);
      } else {
        res.status(200).send({ error: "Not liked" });
      }
    }
  })
});

router.post("/like", function (req, res, next) {
  dbConnect.query("INSERT INTO `likes` (`id`, `username`, `profile`) VALUES ('', '" + req.body.username + "', '" + req.body.profile + "');", function (err, rows, fields) {
    if (err) {
      console.log(err)
      res.status(100).send('Error connecting to database.');
      return
    } else {
      res.status(200).send({ error: "None" });
    }
  })
});

router.post("/unlike", function (req, res, next) {
  dbConnect.query("DELETE FROM `likes` WHERE `username` = '" + req.body.username + "' AND `profile` = '" + req.body.profile + "';", function (err, rows, fields) {
    if (err) {
      console.log(err)
      res.status(100).send('Error connecting to database.');
      return
    } else {
      res.status(200).send({ error: "None" });
    }
  })
});


router.post("/viewed", function (req, res, next) {
  dbConnect.query("SELECT * from views where `username`= '" + req.body.username + "' AND `profile` = '" + req.body.profile + "'", function (err, rows, fields) {
    if (err) {
      res.status(100).send('Error connecting to database.');
      return
    } else {
      if (rows.length > 0) {
        res.status(200).send({ error: "Already viewed" });
      } else {
        dbConnect.query("INSERT INTO `views` (`id`, `username`, `profile`) VALUES ('', '" + req.body.username + "', '" + req.body.profile + "');", function (err, rows, fields) {
          if (err) {
            console.log(err)
            res.status(100).send('Error connecting to database.');
            return
          } else {
            res.status(200).send({ error: "Added to veiwed" });
          }
        })
      }
    }
  })
});

router.post("/grabviewed", function (req, res, next) {
  dbConnect.query("SELECT * from views where `profile` = '" + req.body.profile + "' ORDER BY `ID` DESC LIMIT 5", function (err, rows, fields) {
    if (err) {
      res.status(100).send('Error connecting to database.');
      return
    } else {
      if (rows.length > 0) {
        res.status(200).send(rows)
      }
      else {
        res.status(200).send({})
      }
    }
  })
});

router.post("/grabliked", function (req, res, next) {
  dbConnect.query("SELECT * from likes where `profile` = '" + req.body.profile + "' ORDER BY `ID` DESC LIMIT 5", function (err, rows, fields) {
    if (err) {
      res.status(100).send('Error connecting to database.');
      return
    } else {
      if (rows.length > 0) {
        res.status(200).send(rows)
      }
      else {
        res.status(200).send({})
      }
    }
  })
});




module.exports = router;