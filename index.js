const express = require("express")
const fs = require("fs")
const notes_routes = require("./routes/notes").router
const deletes_routes = require("./routes/deletes").router


const app = express()
app.listen(3000, () => { console.log("Server running.") })
app.use(express.json())
app.use(express.static("./data/public"))

// template engine
app.engine("view", (filePath, options, cb) => {
    fs.readFile(filePath, (error, content) => {
        if (error)
            return cb(error)

        const render = content.toString()
            .replace("#stylesheet#", options.stylesheet)
            .replaceAll("#title#", options.title)
            .replace("#content#", options.content)

        return cb(null, render)
    })
})
app.set("views", "./views")
app.set("view engine", "view")

// routers
app.use("/api/notes", notes_routes)
app.use("/api/deleted_items", deletes_routes)

app.use((request, response, next) => {
    console.log("Request received at " + new Date().toLocaleString())
    next()
})


app.get("/", (request, response) => {
    // HATEOAS links
    let links = [
        {
            href: "/api",
            rel: "api",
            type: "GET",
        },
    ]

    response.json({ links })
})


// Error-handling middleware
app.use((error, request, response, next) => {
    response.status(error.status || 500)
    response.json({error: error.message})
})
