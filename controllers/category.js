const Category = require('../models/category');

const {errorHandler} = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next) => {
	// category model find category by passed id and get error or category
	Category.findById(id).exec((err, category) => {
		// if error or no category handle error
		if(err || !category) {
			return res.status(400).json({
				error: "Category does not exist"
			});
		}
		// make category available to request and next
		req.category = category;
		next();
	});
};

// get all categories
exports.list = (req, res) => {
	Category.find().exec((err, data) => {
		if(err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		res.json({data});
	});
};

exports.create = (req, res) => {
	const category = new Category(req.body);
	category.save((err, data) => {
		if(err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		res.json({data});
	});
};

exports.read = (req, res) => {
	return res.json(req.category);
};

exports.update = (req, res) => {
	const category = req.category;
	category.name = req.body.name;
	category.save((err, data) => {
		if(err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		res.json({
			data,
			message: "Category updated successfully"
		});
	});
};

exports.remove = (req, res) => {
	const category = req.category;
	category.remove((err, data) => {
		if(err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		res.json({
			message: "Category deleted successfully"
		});
	});
};

