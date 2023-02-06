const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');

const noteData = require('./db/db.json');

const PORT = (process.env.PORT || 3001);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.status(200).json(noteData)
);

app.post('/api/notes', (req, res) => {

  console.log(req.body);

  const { title, text } = req.body;

  if (text && title) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    var newNoteData = noteData;
    newNoteData.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(newNoteData), function (err) {
      if (err) throw err;
      console.log('Replaced!');
    });

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }

});

app.delete("/api/notes/:id", function(req, res) {

  var newNoteData = noteData;

  let obj = newNoteData.find(x => x.id === req.body.id);
  let index = newNoteData.indexOf(obj);

  newNoteData.splice(index, 1);

  fs.writeFile('./db/db.json', JSON.stringify(newNoteData), function (err) {
    if (err) throw err;
    console.log('Replaced!');
  });

  res.status(201).json(obj);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
