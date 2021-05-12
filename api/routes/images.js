var Images = require('../models/image')
var express = require('express')
var fs = require('fs')
var router = express.Router()

router.route("/")
	.post((request, response) => {
		var buffer = new Buffer(request.body.imagePayload, "base64")
		var extension = request.body.mimeType.substring(request.body.mimeType.indexOf("/") + 1)
		var fileName = `/var/image-server/data/${Date.now()}.${extension}`
		fs.writeFile(fileName, buffer, (fileError) => {
			if (fileError) {
				response.send(fileError)
				return
			}

			request.body.filePath = fileName
			Images.create(request.body, (err, result) => {
				if (err) {
					response.send(err)
					return
				}
	
				response.json(result)
			})
		})
	})
	.get((request, response) => {
		if (request.query.extension) {
			Images.find({mimeType: request.query.extension}, (err, result) => {
				if (err) {
					return response.send(err);
				}

				return response.json(result);
			});
			return;
		}

		Images.find({}, (err, result) => {
			if (err) {
				return response.send(err)
			}

			return response.json(result);
		})
	})

router.route("/:id/file")
	.get((request, response) => {
		Images.findById(request.params.id, (err, result) => {
			if (err) {
				response.send(err)
				return
			}

			if (!result) {
				response.status(404)
				return
			}

			response.setHeader("content-type", result.mimeType)
			response.sendFile(result.filePath)
			return
		})
	})

router.route("/:id")
	.get((request, response) => {
		Images.findById(request.params.id, (err, result) => {
			if (err) {
				response.send(err)
				return
			}

			if (!result) {
				response.status(404)
				return
			}

			if (request.header("accept").startsWith("image/") || request.header("accept").startsWith("video/") || request.header("accept").startsWith("audio/")) {
				response.setHeader("content-type", result.mimeType)
				response.sendFile(result.filePath)
			} else {
				console.log("JSON")
				response.json(result)
			}

			return
		})
	})

module.exports = router;
