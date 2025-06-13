const express = require("express")
const deletes = require("../data/deletes")


const router = express.Router()

router.use((request, response, next) => {
    console.log("Request received at " + new Date().toLocaleString())
    next()
})


router.route("/")
    .get((request, response, next) => {
        response.json(deletes)
    })

router.route("/:id")
    .patch((request, response) => {
        // restore item
        const notes = require("./notes").notes
        const id = request.params.id

        const note = deletes.find((item, d) => {
            if (item.id == id) {
                // remove item from deleted list
                delete item.deleted_at
                deletes.splice(d, 1)

                // find position in notes list
                const i = notes.findIndex((note) => note.id > id)
                if (i !== -1)
                    notes.splice(i, 0, item)
                else
                    notes.push(item)
                return true
            }
        })
        
        if (note)
            response.json(note)
        else
            next()
    })
//


module.exports = {router, deletes}