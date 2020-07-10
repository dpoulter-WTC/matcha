var express = require("express");
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'matcha',
    password: 'password',
    database: 'matcha'
  })
  
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.code);
      return;
    }
  
    console.log('connected as id ' + connection.threadId);
  });

module.exports = connection;