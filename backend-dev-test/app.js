var express = require('express');
var users = require('./routes/users');
const bodyParser = require('body-parser');
var app = express();
var port = 3001;
const dbConfig = require('./config/dbConfig.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('./routes/users.js')(app);
app.get('/', (req, res) => {
    res.json({"message": "Welcome!"});
});
app.listen(port, () => {
 console.log("Server listening on port " + port);
});