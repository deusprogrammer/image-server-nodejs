let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    title: {
        type: String
    },
    filePath: {
        type: String,
        required: "Filename is required"
    },
    mimeType: {
        type: String,
        required: "Mime type is required"
    }
})

module.exports = mongoose.model("images", schema)