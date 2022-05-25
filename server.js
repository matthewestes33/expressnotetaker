// require dependencies (check line 2)
const express = require('express');
const fs = require('fs');
const path = require('path');

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
        const id = data[data.length - 1].id + 1;
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
// To delete a note: read all notes from db.json, remove note with given id property, and rewrite notes to db.json.
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const idData = JSON.parse(data);
        const deletedNote = req.params.id;
        idData.filter(data => data.id !== deletedNote);
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