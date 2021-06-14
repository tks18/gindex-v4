// Inititalisation
require('dotenv').config();
const express = require("express");
var ping = require('ping');
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const keepAlive = require("./plugins/keepAlive");
const deletePlugin = require('./plugins/deleteAll');
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.DBURL, {useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true})

//Routes
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/ping', require('./routes/ping'));
app.use('/request', require('./routes/request'));
app.use('/user', require('./routes/user'));
app.use('/media', require('./routes/media'));
app.use('/posters', require('./routes/poster'));
app.use('/register', require('./routes/register'));
app.use('/invite', require('./routes/invite'));
app.use('/delete', require('./routes/delete'));
app.use('/settings', require('./routes/settings'));
app.use('/get', require('./routes/get'));
app.use('/spam', require('./routes/spam'));

deletePlugin();
keepAlive();
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log('Server Started on ' + PORT ));
