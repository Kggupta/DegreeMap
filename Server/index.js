require('dotenv').config();

const express = require('express')
const cors = require("cors")
const connection = require('./database');
const UserRoutes = require('./src/UserRoutes');

const app = express();
app.use(cors());


UserRoutes(app, connection);

app.listen(process.env.APIPORT, () => {
  console.log(`Application listening on port ${process.env.APIPORT}`)
});