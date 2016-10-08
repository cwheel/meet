'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');

let app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(compression());

app.use('/', express.static(path.resolve(__dirname, '../dist')));
app.listen(3000);
