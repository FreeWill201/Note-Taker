const express = require("express");
const path = require("path");
const fs = require("fs");

// Create an instance of the Express app
const app = express();

// Set up middleware to handle JSON and urlencoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static file serving for the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set up a route for getting all saved notes
app.get("/db/db.json", (req, res) => {
  // Read the db.json file and send the saved notes as a JSON response
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db", "db.json"))
  );
  res.json(notes);
});

// Set up a route for saving a new note
app.post("/db/db.json", (req, res) => {
  // Read the existing notes from the db.json file
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db", "db.json"))
  );
  // Add the new note to the notes array and assign it a unique id
  const newNote = {
    id: Date.now(),
    title: req.body.title,
    text: req.body.text,
  };
  notes.push(newNote);
  // Write the updated notes array to the db.json file
  fs.writeFileSync(
    path.join(__dirname, "db", "db.json"),
    JSON.stringify(notes)
  );
  // Send the new note as a JSON response
  res.json(newNote);
});

// Set up route handling for the landing page
app.get("/public/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Set up route handling for the notes page
app.get("/public/notes.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Set up a default route that redirects to the landing page
app.get("*", (req, res) => {
  res.redirect("/public/index.html");
});

// Start the server listening on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// http://localhost:3000 accesses this server through the url locally when made avaialble through terminal
