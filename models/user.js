const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true
		},
		hashed_password: {
			type: String,
			required: true
		},
		about: {
			type: String,
			trim: true
		},
		salt: String,
		role: {
			type: Number,
			default: 0
		},
		history: {
			type: Array,
			default: []
		}
	}, 
	{timestamps: true} 
);

// virtual field
userSchema.virtual('password') //send password from client side
.set(function(password) { // takes password from client side
	this._password = password, // takes password makes it equal to password
	this.salt = uuidv1(), // gives us random string
	this.hashed_password = this.encryptPassword(password) // encrypts hashed password
})
.get(function() {
	return this._password;
});

// how to add methods to our user schema
userSchema.methods = {

	authenticate: function(plainText) {
		// return true or false if user can be authenticated
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	encryptPassword : function(password) {
		if(!password) return ''; // if no password then nothing
		try {
			return crypto.createHmac('sha1', this.salt) // crypto node feature to hash passward
							.update(password) // pass password
							.digest('hex')
		} catch (err) { // if error, catches and return nothing
			return '';
		}
	}
};

module.exports = mongoose.model("User", userSchema);