# DegreeMap

Our group is creating a web application that will allow University of Waterloo students to manage their undergraduate career. The application will allow users to track things such as the courses they have taken each term, as well as their final grades, their current course schedules, and their friends in the university. They will be able to visualize all the courses they've taken, their estimated GPA, and the courses that they share with their friends.\\

What sets us apart from other University applications like RateMyProf and UWFlow is that rather than focusing on individual courses, we consider the student's entire university career. We do this by calculating GPA's, persisting data from previous terms, and including this data in future analysis. We also help them plan courses based on pre-requisites and the courses their friends are taking. We will be a tool that the students use during their entire degree.

# Team Members
- Keshav Gupta 
- Isshana Mohanakumar 
- Edward Pei 
- Ricky Lu
- Govind Nair

# Create a local instance of the database

DegreeMap uses a MySQL database.

1. Install MySQL server + workbench
2. Complete configuration steps
3. Enter the database shell

`mysql –u username -p password`

4. Create the database

`CREATE DATABASE degreemap_db;`

5. Use the database

`USE degreemap_db;`

# Populate Data

Only move onto this step once you complete the creation of a local instance of the database.

## Sample Data

```
cd Server
npm install
node SampleData.js
```

Navigate to your mysql database in a Terminal window and you will see the sample data!

## Production Data

Coming soon.
