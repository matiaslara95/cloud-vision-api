const express = require("express");
const app = express();
const router = express.Router();

// import the routes file
const routes = require("./routes/routes");

// body parser configuration
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register the routes 
app.use('/', routes);

// app.use((request, response) => {
//    response.json({ message: 'Hey! This is your server response!' }); 
// });

module.exports = app;