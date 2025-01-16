const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes')

//ROUTE 1:Get all the notes:POST"/api/notes/fetchallnotes" login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
      const notes = await Notes.find({ user: req.user.id });
      res.json(notes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
  

//ROUTE 2:Add new note using post:POST"/api/notes/addnote" login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
  ], async (req, res) => {
    try {
      const { title, description, tag } = req.body;
  
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const note = new Notes({
        title, description, tag, user: req.user.id
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  

//ROUTE 3:update a note using :PUT"/api/notes/updatenote " login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
      const newNote = {};
      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;
  
      let note = await Notes.findById(req.params.id);
      if (!note) return res.status(404).send("Not Found");
  
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
  
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  


//ROUTE 4:deleting a note using :DELETE"/api/notes/deletenote " login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
      let note = await Notes.findById(req.params.id);
      if (!note) return res.status(404).send("Not Found");
  
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
  
      note = await Notes.findByIdAndDelete(req.params.id);
      res.json({ success: "Note has been deleted", note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
module.exports = router



