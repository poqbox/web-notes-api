const express = require("express")
const notes = require("../data/notes")
const error = require("../utils/error")


const router = express.Router()


router.route("/")
    .get((request, response) => {
        response.json(notes)
    })
    .post((request, response, next) => {
        if (request.body.title && request.body.content) {
            const note = {
                id: notes[notes.length - 1].id + 1,
                title: request.body.title,
                content: request.body.content
            }

            notes.push(note)
            response.json(note)
        }
        else {
            next(error(400, "Insufficient Data"))
        }
    })
//


module.exports = router