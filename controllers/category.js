const Category = require('../models/category');

const {errorHandler} = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next) => {
	// category model find category by passed id and get error or category
	Category.findById(id).exec((err, category) => {
		// if error or no category handle error
		if(err || !category) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		// make category available to request and next
		req.category = category;
		next();
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