# DegreeMap

Our group is creating a web application that will allow University of Waterloo students to manage their undergraduate career. The application will allow users to track things such as the courses they have taken each term, as well as their final grades, their current course schedules, and their friends in the university. They will be able to visualize all the courses they've taken, their estimated GPA, and the courses that they share with their friends.

What sets us apart from other University applications like RateMyProf and UWFlow is that rather than focusing on individual courses, we consider the student's entire university career. We do this by calculating GPA's, persisting data from previous terms, and including this data in future analysis. We also help them plan courses based on pre-requisites and the courses their friends are taking. We will be a tool that the students use during their entire degree.

[Demo Video](https://www.youtube.com/watch?v=73rIotVdLA0)

# 1. Team Members
- Keshav Gupta 
- Isshana Mohanakumar 
- Edward Pei 
- Ricky Lu
- Govind Nair

# 2. Create a local instance of the database

DegreeMap uses a MySQL database.

1. Install MySQL server + workbench
2. Complete configuration steps
3. Enter the database shell

`mysql –u username -p password`

4. Create the database

`CREATE DATABASE degreemap;`

5. Use the database

`USE degreemap;`

# 3. Populate Database

Before you can use either Sample or Production data, you must have already followed the database setup steps above at the root of this repository.

You also need a `.env` file in `DegreeMap/Database/.env`. This `.env` file requires the following data to be entered correctly:
```
TOKEN="YOUR API TOKEN FOR THE PROD DATA"
APPUSERNAME="YOUR MYSQL USERNAME"
PASSWORD="YOUR MYSQL PASSWORD"
DATABASE_NAME="degreemap"
HOST="localhost"
PORT=3306
APIPORT=3030
SERVERURL="http://localhost:3030"
USEREMAIL="email@email.com"
USEREMAILPASS="emailpassword"
```

You can get your API Token for the prod data by clicking [here](https://openapi.data.uwaterloo.ca/api-docs/index.html). Simply follow the registration steps and the Token will be emailed to you.

## 3.1 Sample
It is very straightforward to populate the sample data.
1. Navigate to the 'Database' directory.
```
cd DegreeMap/Database
```
2. Install the NPM packages. [Install Node and Npm](https://nodejs.org/en/download) if you haven't already before you do this step.
```
npm install
```
3. Run the data population script for the sample data.
```
node PopulateData.js sample
```
The script will automatically drop the entire existing database tables, recreate the tables, and take the data from the CSV files in `DegreeMap/Database/DataFiles/Sample/`, instead of the production API endpoints if you use the **sample** argument.

## 3.2 Production
It is very straightforward to populate the Production data.
1. Navigate to the 'Database' directory.
```
cd DegreeMap/Database
```
2. Install the NPM packages. [Install Node and Npm](https://nodejs.org/en/download) if you haven't already before you do this step.
```
npm install
```
3. Ensure the `.env` file is correctly filled out using the template described earlier in this section and added at path `DegreeMap/Database/.env`. The script won't work without the `.env` file and token.
4. Run the data population script for the production data.
```
node PopulateData.js prod
```
The script will drop the entire existing database tables, recreate the tables, query the prod api, and re-populate the data. You must use the **prod** argument to populate against the production dataset.

# 4. Running The Application
To start the application, you must first follow all steps to setup and populate the database (described in above sections). Then, start the client and server.

## 4.1 Running The Client
See `client/README.md` for step by step directions on how to start the React front-end.

## 4.2 Running The Server
See `server/README.md` for step by step directions on how to start the Express.js/Node.js back-end.

## 4.3 Running The Database
See earlier sections for this setup.

# 5. Current Features
The application currently supports the following features:
1. Configuring the database tables in `DegreeMap/Database/Queries`
2. Populating the database with the **sample data** using the script in `DegreeMap/Database/PopulateData.js`
3. Populating the database with the **production data** using the script in `DegreeMap/Database/PopulateData.js`
    1. Interface with the Waterloo API using the TOKEN in the `.env` file
4. SQL Query testing for the sample data in `DegreeMap/Database/Queries/TestSample`.
5. SQL Query testing for the production data in `DegreeMap/Database/Queries/TestProduction`.
6. Currently supports the SQL queries related to R6 to R11, and R12, R14, R16 for the sample data.
    1. Both `.sql` and `.out` files for all the features.
    2. Fancy features R13 and R15 are not related to SQL so they don't have this section.
7. Currently supports the SQL queries related to R6 to R11, and R12, R14, R16 for the production data.
    1. Both `.sql` and `.out` files for all the features.
    2. Fancy features R13 and R15 are not related to SQL so they don't have this section.
8. Feature interface descriptions for all R6 - R16 in the report
9.  SQL Scripts in `DegreeMap/Database/Queries`
    1. Creating database
    2. Creating tables
    3.  Creating triggers
    4.  Creating procedures
    5.  Dropping tables
    6.  Queries for R6 - R11, R12, R14, R16

| **Feature**                          | **Frontend**    | **Backend**     |
|--------------------------------------|-----------------|-----------------|
| **R6 - User Management**             | [Auth](https://github.com/Kggupta/DegreeMap/tree/main/Client/src/pages/auth/), [User Management](https://github.com/Kggupta/DegreeMap/tree/main/Client/src/sections/account/) | [Routes](https://github.com/Kggupta/DegreeMap/tree/main/Server/src/UserRoutes.js) |
| **R7 - Course Operations**           | [Create](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/createcourse.js), [Search/Delete/List](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/index.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/CourseRoutes.js) |
| **R8 - User Schedule**               | [Schedule](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/schedule.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/ScheduleRoutes.js) |
| **R9 - Friend Management**           | [Friend](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/friends.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/FriendRoutes.js) |
| **R10 - Taken Courses Management**   | [Manage Taken Courses](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/takecourse.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/TakeCourseRoutes.js) |
| **R11 - Show Courses User Can Take** | [Plan](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/plan.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/PlanRoutes.js) |
| **R12 - Pre-requisite graphs**       | [Graphs](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/prereqgraph.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/PreReqRoutes.js) |
| **R13 - AI Course Suggestion Model** | [Course Suggestion UI](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/takecourse.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/RecommenderRoutes.js), [AI Model Scripts](https://github.com/Kggupta/DegreeMap/tree/main/Server/Recommender) |
| **R14 - Graded Content**             | [Graded Content](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/gradedcontent.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/GradedContentRoutes.js) |
| **R15 - SQL Injection / Hashing**    | [Hashing](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/contexts/auth-context.js) | [SQL Injection. NOTE: All routes were modified.](https://github.com/Kggupta/DegreeMap/commit/ec5e2d367c28cedeb6c916454ef6d4727ec360f1) |
| **R16 - Course Deadlines**           | [Deadline Management](https://github.com/Kggupta/DegreeMap/blob/main/Client/src/pages/deadlines.js) | [Routes](https://github.com/Kggupta/DegreeMap/blob/main/Server/src/DeadlineRoutes.js), [Sending Email](https://github.com/Kggupta/DegreeMap/blob/0a9fd26bb0988a3aceb21e346e8f9f9ccafc6a10/Server/index.js#L40C8-L40C8) |

# 6. Milestone Reports
See `MilestoneReports/MX` to view the report PDFs and assets.
