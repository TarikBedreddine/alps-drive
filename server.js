//app

const express = require('express');

const app = express();

app.use(express.static('frontend'));

module.exports = app;
