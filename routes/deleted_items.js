const express = require("express")
const deleted_items = require("../data/deleted_items")


const router = express.Router()


router.route("/")
    .get((request, response) => {
        response.json(deleted_items)
    })
//


module.exports = {router, deleted_items}