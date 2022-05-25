// require npm dependencies 
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// initialize the app and create a port (Heroku requires PORT to be capitalized)
const app = express();
const PORT = process.env.PORT || 3001;

// setup middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup static folder
app.use(express.static('public'));

// GET Route for index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route 
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const noteData = JSON.parse(data);
        console.log(noteData);
        res.json(noteData);
    });
});

// POST route
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let id = req.body.id = uuidv4();
        console.log(data)
        const newNote = { title: req.body.title, text: req.body.text, id: id };
        const noteData = JSON.parse(data);
        noteData.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err, data) => {
            if (err) throw err;
            res.json(noteData);
        })
    });
});

// DELETE route: DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. 
app.delete('/api/notes/:id', (req, res) => {
    // To delete a note: read all notes from db.json
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        // remove note with given id property
        const idData = JSON.parse(data);
        const deletedNote = req.body.id;
        idData.filter(data => data.id !== deletedNote);
        // rewrite notes to db.json
        fs.writeFile('./db/db.json', JSON.stringify(idData), (err, data) => {
            if (err) throw err;
            res.json(idData);
        })
    });
});

// listening for port and message
app.listen(PORT, () =>
    console.log(`App listening on PORT: ${PORT}`)
);