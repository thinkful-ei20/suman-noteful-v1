'use strict';

const data = require('./db/notes');

const express = require("express");
const app = express();

app.use(express.static('public'));

app.get('/api/notes',(req,res)=>{
  //res.json(data);
  const searchTerm = req.query.searchTerm;
  res.json(data.filter(note => note.title.includes(searchTerm) || note.content.includes(searchTerm)));
});

app.get('/api/notes/:id', (req,res) => {
  const id = req.params.id;    
  const myNote = data.find(item=> item.id === Number(id));
  console.log(myNote);
  res.json(myNote);
});


console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

// Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
