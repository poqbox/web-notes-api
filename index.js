const express = require("express")
const notes_routes = require("./routes/notes")


const app = express()
app.listen(3000, () => { console.log("Server running.") })
app.use("/api/notes", notes_routes)


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
