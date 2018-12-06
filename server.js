const express = require('express');
const people = require('./people.json');
const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Homepage',
    people: people.profiles
  });
});

const server = app.listen(80, () => {
  console.log(`Server running → PORT ${server.address().port}`);
});
