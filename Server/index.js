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
const GradedContent = require('./src/GradedContentRoutes');
const DeadlineRoutes = require('./src/DeadlineRoutes');
const nodemailer = require('nodemailer');
const app = express();
app.use(cors());

// Register routes
UserRoutes(app, connection);
CourseRoutes(app, connection);
TakeCourseRoutes(app, connection);
ScheduleRoutes(app, connection);
PlanRoutes(app, connection);
FriendRoutes(app, connection);
RecommenderRoutes(app);
PreReqRoutes(app, connection);
TakeCourseRoutes(app, connection);
GradedContent(app, connection);
DeadlineRoutes(app, connection);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USEREMAIL,
    pass: process.env.USEREMAILPASS
  }
})

setTimeout(() => {
  const query = "SELECT email, subject, course_number, Deadlines.name AS deadline_name, User.name AS user_name, due_date "+
  "FROM Deadlines "+
  "JOIN User ON Deadlines.uid = User.uid "+
  "WHERE due_date < NOW();";

  console.log(query);
  connection.query(query, (error, results, fields) => {
    console.log("SENDING EMAILS");
    if (error) return console.log(error);
    results.forEach(async duedate => {
      transporter.sendMail({
        from: process.env.USEREMAIL,
        to: duedate.email,
        subject: `DEADLINE: ${duedate.subject} ${duedate.course_number}`,
        text: `${duedate.deadline_name} is due, Don't forget to submit it!`
      })
    })

    const query2 = "DELETE FROM Deadlines WHERE due_date < NOW();";
    console.log(query2)
    connection.query(query2, (error, results, fields) => {
      if (error) console.log(error);
    })
  })
}, 1000*15)

app.listen(process.env.APIPORT, () => {
  console.log(`Application listening on port ${process.env.APIPORT}`)
});