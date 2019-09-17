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
		// check for all fields
		const { name, description, price, category, quantity, shipping } = fields;
		if(!name || !description || !price || !category || !quantity || !shipping) {
			return res.status(400).json({
				error: "All fields are required"
			});
		}
		// with no errors, create a new product using data in fields
		let product = new Product(fields);
		// if were are sending an image file from front end
		if(files.photo) {
			if(files.photo.size > 1000000) {
				return res.status(400).json({
					error: "Image should be less than 1mb in size"
			});
			}
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