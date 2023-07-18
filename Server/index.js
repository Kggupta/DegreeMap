require('dotenv').config();

const express = require('express')
const cors = require("cors")
const connection = require('./database');
const UserRoutes = require('./src/UserRoutes');
const CourseRoutes = require('./src/CourseRoutes');
const ScheduleRoutes = require('./src/ScheduleRoutes');
const PlanRoutes = require('./src/PlanRoutes')
const FriendRoutes = require('./src/FriendRoutes');
const RecommenderRoutes = require("./src/RecommenderRoutes");
const PreReqRoutes = require('./src/PreReqRoutes');
const TakeCourseRoutes = require('./src/TakeCourseRoutes');

const app = express();
app.use(cors());

// Register routes
UserRoutes(app, connection);
CourseRoutes(app, connection);
ScheduleRoutes(app, connection);
PlanRoutes(app, connection);
FriendRoutes(app, connection);
RecommenderRoutes(app);
PreReqRoutes(app, connection);
TakeCourseRoutes(app, connection);

app.listen(process.env.APIPORT, () => {
  console.log(`Application listening on port ${process.env.APIPORT}`)
});