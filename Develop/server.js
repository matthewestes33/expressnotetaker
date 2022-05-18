// require express and fs
const express = require('express');
const fs = require('fs');

// initialize the app and create a port
const app = express();
const PORT = process.env.port || 3001;

// setup middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup static folder
app.use(express.static('public'));

// create a list of routes

// GET route
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const parsedData = JSON.parse(data);
        console.log(parsedData);
    });
});

// POST route
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const parsedData = JSON.parse(data);
        const newNote = req.body;
        parsedData.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err, data) => {
            if (err) throw err;
            res.json(parsedData);
        })
    });
});

// DELETE route

// listening for port and message
app.listen(PORT, () =>
  console.log(`App listening on PORT: ${PORT}`)
);