const express = require("express")
const error = require("../utils/error")
const Regex = require("../utils/regex")
const notes = require("../data/notes")
const deletes = require("./deletes").deletes


const router = express.Router()

router.use((request, response, next) => {
    console.log("Request received at " + new Date().toLocaleString())
    next()
})


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

router.route("/search")
    .get((request, response) => {
        const title = request.query["title"]
        const content = request.query["content"]
        const query_notes = search(title, content)

        response.json(query_notes)
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
                const item = notes.splice(i, 1)[0]
                item.deleted_at = new Date()
                deletes.unshift(item)
                return true
            }
        })

        if (note)
            response.json(note)
        else
            next()
    })

router.route("/render/:id")
    .get((request, response, next) => {
        const options = {}
        const id = request.params.id
        const note = notes.find((_) => {
            if (_.id == id) {
                options.title = _.title
                options.content = _.content
                return true
            }
        })

        if (note)
            response.render("notes", options)
        else
            next()
    })
//


function search(title, content) {
    // search engine
    const query_notes = []
    const reTitle = Regex.fromSearchQuery(title)
    const reContent = Regex.fromSearchQuery(content)
    notes.forEach((_) => {
        if (reTitle.test(_.title) && reContent.test(_.content))
            query_notes.push(_)
    })

    return query_notes
}


module.exports = {router, notes}