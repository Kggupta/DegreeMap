# DegreeMap

Our group is creating a web application that will allow University of Waterloo students to manage their undergraduate career. The application will allow users to track things such as the courses they have taken each term, as well as their final grades, their current course schedules, and their friends in the university. They will be able to visualize all the courses they've taken, their estimated GPA, and the courses that they share with their friends.\\

What sets us apart from other University applications like RateMyProf and UWFlow is that rather than focusing on individual courses, we consider the student's entire university career. We do this by calculating GPA's, persisting data from previous terms, and including this data in future analysis. We also help them plan courses based on pre-requisites and the courses their friends are taking. We will be a tool that the students use during their entire degree.

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

`CREATE DATABASE degreemap_db;`

5. Use the database

`USE degreemap_db;`

# 3. Populate Database

Before you can use either Sample or Production data, you must have already followed the database setup steps above at the root of this repository.

You also need a `.env` file in `DegreeMap/Database/.env`. This `.env` file requires the following data to be entered correctly:
```
TOKEN="YOUR API TOKEN FOR THE PROD DATA"
USERNAME="YOUR MYSQL USERNAME"
PASSWORD="YOUR MYSQL PASSWORD"
DATABASE_NAME="degreemap"
HOST="localhost"
PORT=3306
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
TODO
# 4.1 Running The Back-End
TODO
# 4.2 Running The Front-End
TODO

# 5. Current Features
TODO