var express = require('express')
var logger = require('morgan')
var mongoose = require('mongoose')
var cors = require('cors')

var imageRouter = require('./api/routes/images')
var app = express()

app.use(logger('dev'))
app.subscribe(cors)
app.use(express.json({limit: "10Mb"}))
app.use(express.urlencoded({ extended: false }))

// Mongoose instance connection url connection
var databaseUrl = process.env.IMAGE_DB_URL
mongoose.Promise = global.Promise
mongoose.connect(databaseUrl)

app.use('/images', imageRouter)

module.exports = app