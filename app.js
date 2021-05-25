const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const passport = require('passport')
const {jwtAuthStrategy} = require('./api/config/passportConfig')

const imageRouter = require('./api/routes/images')
const app = express()

passport.use(jwtAuthStrategy);

app.use(logger('dev'))
app.use(cors())
app.use(express.json({limit: "500Mb"}))
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize());

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

// Used for legacy
app.use('/images', passport.authenticate("jwt", { session: false }), imageRouter);

// New endpoint
app.use('/media', passport.authenticate("jwt", { session: false }), imageRouter);

module.exports = app