
'use strict';

const express = require('express');
const {PORT} = require('./config');
const {requestLogger} = require('./middleware/logger');

// Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this

// Create an Express application
const app = express();

// Create a static webserver
app.use(express.static('public'));
app.use(express.json());
app.use(requestLogger);
// Get All (and search by query)
app.get('/api/notes', (req, res, next) => {
  const {searchTerm} = req.query;

  notes.filter(searchTerm,(err,list) => {
    if(err){
      return next(err);
    }
    res.json(list);
  });
  // const searchTerm = req.query.searchTerm;
  // if (searchTerm) {
  //   let filteredList = data.filter(function(item) {
  //     return item.title.includes(searchTerm);
  //   });
  //   res.json(filteredList);
  // } else {
  //   res.json(data);
  // }

  // Terse solution
  // const { searchTerm } = req.query;
  // res.json(searchTerm ? data.filter(item => item.title.includes(searchTerm)) : data);

});

// Get a single item

// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });


app.get('/api/notes/:id', (req, res,next) => {
  const id = req.params.id;
  notes.find(id,(err,item)=>{
    if(err){
      return next(err);
    }
    res.json(item);
  });
  // // Verbose solution
  // let note = data.find(function(item) {
  //   return item.id === Number(id);
  // });
  // res.json(note);

  // Terse solution
  // res.json(data.find(item => item.id === Number(id)));

});

app.put('/api/notes/:id',(req,res,next)=>{  
  const id = req.params.id;  
  const updateObj ={};
  const updateFields = ['title','content'];

  updateFields.forEach(field => {
    if(field in req.body){
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id,updateObj,(err,item)=>{  
    if(err){
      return next(err);
    }
    if(item){
      res.json(item);
    }else{
      next();
    }
  });
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
