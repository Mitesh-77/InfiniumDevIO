require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/',require('./routes/users'))


app.listen(port);