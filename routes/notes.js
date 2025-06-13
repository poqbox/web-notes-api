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

router.route("/:id")
    .get((request, response, next) => {
        const id = request.params.id
        const note = notes.find((_) => _.id == id)

        if (note)
            response.json(note)
        else
            next()
    })
    .patch((request, response, next) => {
        const id = request.params.id
        if (request.body.title || request.body.content) {
            const note = notes.find((_) => {
                if (_.id == id) {
                    if (request.body.title) {_.title = request.body.title}
                    if (request.body.content) {_.content = request.body.content}
                    return true
                }
            })

            if (note)
                response.json(note)
        }
        next()
    })
    .delete((request, response, next) => {
        const id = request.params.id
        const note = notes.find((_, i) => {
            if (_.id == id) {
                notes.splice(i, 1)
                return true
            }
        })

        if (note)
            response.json(note)
        else
            next()
    })

router.route("/search")
    .get((request, response, next) => {
        const title = request.query["title"]
        const content = request.query["content"]
        const query_notes = search(title, content)

        response.json(query_notes)
    })
//


function search(title, content) {
    // search engine
    const query_notes = []
    const reTitle = new RegExp((title) ? String.raw`^.*${title}.*$` : String.raw`.*`)
    const reContent = new RegExp((content) ? String.raw`^.*${content}.*$` : String.raw`.*`)
    notes.forEach((_) => {
        if (reTitle.test(_.title) && reContent.test(_.content))
            query_notes.push(_)
    })

    return query_notes
}


module.exports = router