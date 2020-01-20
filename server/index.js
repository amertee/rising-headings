const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const htmlParser = require('./html-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/page', (req, res) => {
  console.log("server (number): " + req.query.number );
  const numberOfPages = req.query.number || -1;
  res.setHeader('Content-Type', 'application/json');

  htmlParser.getHeadings(numberOfPages).then((headings) => {
    res.send(headings);
  });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);