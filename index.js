const express = require("express")
const notes_routes = require("./routes/notes").router
const deletes_routes = require("./routes/deletes").router


const app = express()
app.listen(3000, () => { console.log("Server running.") })
app.use(express.json())
app.use("/api/notes", notes_routes)
app.use("/api/deleted_items", deletes_routes)


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
