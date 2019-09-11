const express = require('express');
const app = express();

//allows use to use .env file
require('dotenv').config();

app.get('', (req, res) =>  {
	res.send("hello from node");
});

//gives us access to env file and the port
const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});