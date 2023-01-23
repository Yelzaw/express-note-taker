const express =require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const notes = require('./db/db.json');
const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils');

//Helper method for unique ids
const { v4: uuid } = require ('uuid');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and URL encoded form data
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));


//GET Route for homepage
app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//GET Route for notes
app.get('/notes', (req, res)=> 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)
//GET single note
app.get('/api/notes/:id',(req, res)=>{
    res.json(notes[req.params.id]);
})

//GET request for notes
app.get('/api/notes/', (req, res)=>{
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


//POST request to add a note
app.post('/api/notes', (req, res)=>{
    // Log that a POST request was received
  console.info(`${req.method} request received to save note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newFeedback = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newFeedback, './db/db.json');

    const response = {
      status: 'success',
      body: newFeedback,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
})

// DELETE the note
app.delete('/api/notes/:id', (req, res)=> {
    const notedID = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((note) => note.id !== notedID);
            writeToFile('./db/db.json', result);
            res.json(`Noted${notedID} has been deleted.`);
        });
});

// GET * to route back to homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);