var Images = require('../models/image')
var express = require('express')
var fs = require('fs')
const { authenticatedUserHasRole } = require('../utils/SecurityHelper')
var router = express.Router()

router.route("/")
	.post((request, response) => {
		if (!authenticatedUserHasRole(request, "MEDIA_UPLOADER")) {
			response.status(401);
			return response.send();
		}
		let buffer = new Buffer(request.body.imagePayload, "base64")
		let extension = request.body.mimeType.substring(request.body.mimeType.indexOf("/") + 1)
		let fileName = `/var/image-server/data/${Date.now()}.${extension}`
		fs.writeFile(fileName, buffer, (fileError) => {
			if (fileError) {
				return response.send(fileError);
			}

			request.body.filePath = fileName
			Images.create(request.body, (err, result) => {
				if (err) {
					return response.send(err);
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
