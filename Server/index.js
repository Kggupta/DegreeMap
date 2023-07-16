require('dotenv').config();

const express = require('express')
const cors = require("cors")
const connection = require('./database');
const UserRoutes = require('./src/UserRoutes');
const CourseRoutes = require('./src/CourseRoutes');
const ScheduleRoutes = require('./src/ScheduleRoutes');
const FriendRoutes = require('./src/FriendRoutes');
const RecommenderRoutes = require("./src/RecommenderRoutes");

const app = express();
app.use(cors());

// Register routes
UserRoutes(app, connection);
CourseRoutes(app, connection);
ScheduleRoutes(app, connection);
FriendRoutes(app, connection);
RecommenderRoutes(app);

app.listen(process.env.APIPORT, () => {
  console.log(`Application listening on port ${process.env.APIPORT}`)
});