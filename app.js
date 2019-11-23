var express = require('express')
var logger = require('morgan')
var mongoose = require('mongoose')
var cors = require('cors')

var imageRouter = require('./api/routes/images')
var app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json({limit: "10Mb"}))
app.use(express.urlencoded({ extended: false }))

// Mongoose instance connection url connection
var databaseUrl = process.env.IMAGE_DB_URL
mongoose.Promise = global.Promise


var connectWithRetry = function() {
    return mongoose.connect(databaseUrl, function(err) {
        if (err) {
            console.warn('Failed to connect to mongo on startup - retrying in 5 sec');
            setTimeout(connectWithRetry, 5000);
        }
    });
};
connectWithRetry();

app.use('/images', imageRouter)

module.exports = app