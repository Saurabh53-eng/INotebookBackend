const express = require('express');
const router = express.Router();
const Notes = require('../models/Note');
let fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

router.get("", (req, res) => {
    res.json("hii")
})
//Route 1: fetch all notes of a user using GET
router.get('/fetchallnotes', fetchuser,
    async (req, res) => {
        try {
            //fetch all the notes linked with the user id
            const note = await Notes.find({ user: req.user.id })
            res.json(note)

        } catch (error) {
            res.status(500).send("Internal server error has occured")
        }
    })

//Route 2: Add a new  note using POST
router.post('/addnote', fetchuser, [
    body('title', 'title must contains atleast 1 characters'),
    body('description', 'Description must contains atleast 1 characters'),
    body('tag', 'Tag must atleast 1 character long'),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const note = await Notes.create({
                user: req.user.id,
                title: req.body.title,
                description: req.body.description,
                tag: req.body.tag
            })
            res.send(note)
        } catch (error) {
            res.status(500).send("Internal server error has occured")
        }
    })

//Route 3: Update an existing note using PUT
router.put('/updatenote/:id', fetchuser,
    async (req, res) => {
        try {
            let { title, description, tag } = req.body;

            //create a new note object
            const newNote = {}
            if (title) { newNote.title = title };
            if (description) { newNote.description = description };
            if (tag) { newNote.tag = tag };

            //find the note to be updated and update it
            let note = await Notes.findById(req.params.id);
            if (!note) {
                return res.status(404).send("Not Found");
            }
            if (note.user.toString() !== req.user.id) {
                return res.status(404).send("Not Allowed")
            }
            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json({ note })
        } catch (error) {
            res.status(500).send("Internal server error has occured")
        }

    })


//Route 4: Delete an existing note using DELETE
router.delete('/deletenote/:id', fetchuser,
    async (req, res) => {
        try {
            //find the note to be updated and delete it
            let note = await Notes.findById(req.params.id);
            if (!note) {
                return res.status(404).send("Not Found");
            }
            //allow deletion only if user owns this note
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not Allowed")
            }
            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({ "success": "Deleted", note: note })
        } catch (error) {
            res.status(500).send("Internal server error has occured")
        }

    })



module.exports = router
