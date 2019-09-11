const express = require('express');
const mongoose = require('mongoose');
//allows use to use .env file
require('dotenv').config();

// app
const app = express();

// database
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => console.log('DB connected'))

// routes
app.get('', (req, res) =>  {
	res.send("Welcome To Your Homepage!");
});

//gives us access to env file and the port
const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});