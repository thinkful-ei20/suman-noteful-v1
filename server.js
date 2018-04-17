
'use strict';

const express = require('express');
const {PORT} = require('./config');
const {requestLogger} = require('./middleware/logger');

// Simple In-Memory Database
const data = require('./db/notes');

// Create an Express application
const app = express();

// Create a static webserver
app.use(express.static('public'));
app.use(requestLogger);
// Get All (and search by query)
app.get('/api/notes', (req, res) => {

  // Send JSON response (data is an array of objects)
  // res.json(data);

  /**
   * Implement Search
   * Below are 2 solutions: verbose and terse. They are functionally identical but use different syntax
   *
   * Destructure the query string property in to `searchTerm` constant
   * If searchTerm exists...
   * then `filter` the data array where title `includes` the searchTerm value
   * otherwise return `data` unfiltered
   */

  // Verbose solution
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    let filteredList = data.filter(function(item) {
      return item.title.includes(searchTerm);
    });
    res.json(filteredList);
  } else {
    res.json(data);
  }

  // Terse solution
  // const { searchTerm } = req.query;
  // res.json(searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data);

});

// Get a single item

// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });


app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;

  // Verbose solution
  let note = data.find(function(item) {
    return item.id === Number(id);
  });
  res.json(note);

  // Terse solution
  // res.json(data.find(item => item.id === Number(id)));

});

//ERROR HANDLING 
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
// 'use strict';

// const data = require('./db/notes');

// const express = require("express");
// const app = express();

// app.use(express.static('public'));

// app.get('/api/notes',(req,res)=>{
//   //res.json(data);
//   console.log(req.query);
//   const searchTerm = req.query.searchTerm;
//   res.json(data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm)));
//   // OR -- 
// });

// app.get('/api/notes/:id', (req,res) => {
//   const id = req.params.id;    
//   const myNote = data.find(item=> item.id === Number(id));
//   console.log(myNote);
//   res.json(myNote);
// });


// console.log('Hello Noteful!');

// // INSERT EXPRESS APP CODE HERE...

// // Listen for incoming connections
// app.listen(8080, function () {
//   console.info(`Server listening on ${this.address().port}`);
// }).on('error', err => {
//   console.error(err);
// });
