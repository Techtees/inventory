const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const colors = require("colors")
const cors = require("cors");

const userRoute = require("./routes/userRoute") 
const errorHandler = require("./middleWare/errorMiddleWare")

const app  = express()

// app.use(colors)

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

// Route Middleware
app.use("/api/users", userRoute)

// Routes
app.get("/", (req, res) => {
    res.send("Home Page")
})

// Error Middleware
app.use(errorHandler)


//Connect to DB and start server
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})
.catch((err) => console.log(err))