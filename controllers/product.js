const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Product = require("../models/product");
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.productById= (req, res, next, id) => {
	// find product by passed in id and get error or product
	Product.findById(id).exec((err, product) =>{
		// Error handler if no product found or error
		if(err || !product) {
			return res.status(400).json({
				error: "Product not found"
			})
		}
		// if product found, make it available in request object as product
		req.product = product;
		// middleware will run then continue with application
		next();
	});
};

exports.read = (req, res) => {
	// inefficient to send photo here because of large size
	req.product.photo = undefined;
	return res.json(req.product);
};

exports.create = (req, res) => {
	// get incoming form data
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

exports.update = (req, res) => {
	// get incoming form data
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
		// with no errors, update product using data in fields
		let product = req.product;
		// extend is from lodash
		product = _.extend(product, fields);
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
			res.json({
				result,
				message: "Product updated successfully"
			});
		});
	});
};

exports.remove = (req, res) => {
	let product = req.product;
	product.remove((err, deletedProduct) => {
		if(err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		res.json({
			message: "Product deleted successfully"
		});
	});
};

/*
	Most popular and new products for sale
	-- most popular = /products?sortBy=sold&order=desc&limit=5
	-- most recent = /products?sortBy=createdAt&order=desc&limit=5
	-- if no params are sent, then all products returned
*/
exports.list = (req, res) => {
	// if we get order, sortby, or limit from route param 
	// we use req.query value otherwise we default to ascending, sortby id, and limit 5
	let order = req.query.order ? req.query.order : 'asc';
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
	let limit = req.query.limit ? parseInt(req.query.limit) : '5';

	// get all products, deselect photo because large file size
	// populate category field,
	// sort and or limit and execute
	Product.find()
		.select("-photo")
		.populate("category")
		.sort([[sortBy, order]])
		.limit(limit)
		.exec((err, data) => {
			if(err) {
				return res.status(400).json({
					error: "Products not found"
				});
			}
			res.send(products);
		});
};

/*
	it will find the products based on the req product category
	and other products that has the same category will be returned
 */
exports.listRelated = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : '5';
	// $ne mongodb for not included
	// finds all products in category except for the excluded product
	Product.find({_id: {$ne: req.product}, category: req.product.category})
	.limit(limit)
	.populate('category', '_id name')
	.exec((err, products) => {
		if(err) {
			return res.status(400).json({
				error: "Products not found"	
			});
		}
		res.json(products);
	});
};

exports.listCategories = (req, res) => {
	Product.distinct("category", {}, (err, categories) => {
		if(err) {
			return res.status(400).json({
				error: "Categories not found"	
			});
		}
		res.json(categories);
	});
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
  
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};