// require dependencies 
// const { Router } = require('express');
const express = require('express');
const fs = require('fs');
const path = require("path");

// initialize the app and create a port
const app = express();
const PORT = process.env.port || 3001;

// setup middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup static folder
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route ()
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
        const noteData = JSON.parse(data);
        const newNote = req.body;
        noteData.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err, data) => {
            if (err) throw err;
            res.json(noteData);
        })
    });
});

// DELETE route (works better)
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let noteData = JSON.parse(id);
        const deletedNote = req.params.title;
        noteData = noteData.filter(note => note.id !== deletedNote);
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err, data) => {
            if (err) throw err;
            res.json(noteData);
        })
    });
});

// listening for port and message
app.listen(PORT, () =>
    console.log(`App listening on PORT: ${PORT}`)
);