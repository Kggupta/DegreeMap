require('dotenv').config();

const express = require('express')
const connection = require('./database');
const UserRoutes = require('./src/UserRoutes');

const app = express();
app.use(express.json());


UserRoutes(app, connection);

app.listen(process.env.APIPORT, () => {
  console.log(`Application listening on port ${process.env.APIPORT}`)
});