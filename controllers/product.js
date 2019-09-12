const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Product = require("../models/product");
const {errorHandler} = require('../helpers/dbErrorHandler');


exports.create = (req, res) => {
	// create new form from incoming form data
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	// if errors, respond with errors
	form.parse(req, (err, fields, files) => {
		if(err) {
			res.status(400).json({
				error: "Image could not be uploaded"
			});
		}
		// with no errors, create a new product using data in fields
		let product = new Product(fields);
		// if were are sending an image file from front end
		if(files.photo) {
			// photo data = file system, read files syncronously at the photo path
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}
		// save our product if no errors
		product.save((err, result) => {
			if(err) {
				return res.status(400).json({
					error: errorHandler(err)
				});
			}
			// if no error, our product saved successfully
			res.json(result);
		});
	});
};