const express =require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json')

//Helper method for unique ids
const uuid = require ('./helpers/uuid')

const PORT = 3001;

const app = express();


// Middleware for parsing JSON and URL encoded form data
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use('/api', api);

app.use(express.static('public'));

//GET Route for homepage
app.get('/', (req, res)=> 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET Route for notes
app.get('/notes', (req, res)=> 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
)

//GET request for notes
app.get('/api/notes/', (req, res)=>res.json(notes));


//POST request to add a note
app.post('/api/notes', (req, res)=>{
    const { title, text} = req.body;

    if(title && text){
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data)=>{
            if(err){
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (noteErr) =>
                        noteErr
                            ? console.error(noteErr)
                            : console.info('Sucessfully updated the notes')
                );
            }
        });
    }
})





app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);