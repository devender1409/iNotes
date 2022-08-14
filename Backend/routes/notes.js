const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 2: Create notes for a user: GET "/api/notes/addnote". Login required
router.post('/addnote', fetchuser,
    // validating notes
   body('title','Enter a valid Title').isLength({min:3}),
    // description must be at least 5 chars long
    body('description','Description length should be greater then 5').isLength({ min: 5 }),

    async (req, res) => {
        try {
            const{title,description,tag} = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }
    
            const note =new Note({
                title,description,tag,user:req.user.id
            })
            const savedNote = await note.save();
    
            res.send(savedNote);
            
        } catch (error) {
            return res.status(500).send("Internal server error");
        }
    
})


// ROUTE 3: Update and existing note for a user: GET "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser,

    async (req, res) => {
        const { title, description, tag } = req.body;
        try {
            // Create a newNote object
            const newNote = {};
            if (title) { newNote.title = title };
            if (description) { newNote.description = description };
            if (tag) { newNote.tag = tag };
    
            // Find the note to be updated and update it
            let note = await Note.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }
    
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed");
            }
            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json({ note });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    
});


// ROUTE 3: deleting an existing note for a user: GET "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser,

    async (req, res) => {
    
        try {
            // find the note to be deleted and delete it
            let note = await Note.findById(req.params.id);
            if(!note){return res.status(401).send("Not allowed")};

            if(note.user.toString()!== req.user.id){
                return res.status(401).send("Not allowed");
            }

            note = await Note.findByIdAndDelete(req.params.id)
            res.json({ "Success": "Note has been deleted", note: note });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send("Internal server error");
        }
        
        
    
});

module.exports = router