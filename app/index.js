const express = require("express")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")

const app = express()

const router = require("../router")

app.set("view engine", 'ejs')
app.use("/static", express.static("public/css"))

dotenv.config()

app.use(cookieParser())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)


module.exports = app