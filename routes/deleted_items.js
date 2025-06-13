const express = require("express")
const error = require("../utils/error")
const deleted_items = require("../data/deleted_items")


const router = express.Router()


router.route("/")
    .get((request, response, next) => {
        response.json(deleted_items)
    })

router.route("/:id")
    .patch((request, response) => {
        // restore item
        const notes = require("./notes").notes
        const id = request.params.id

        const note = deleted_items.find((item, d) => {
            if (item.id == id) {
                // remove item from deleted list
                delete item.deleted_at
                deleted_items.splice(d, 1)

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


module.exports = {router, deleted_items}