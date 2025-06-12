const express = require("express")
const notes = require("../data/notes")


const router = express.Router()


router.route("/")
    .get((request, response) => {
        response.json(notes)
    })
//


module.exports = router