# Populate The Database
This module gives full functionality populating the sample or production data.

## Configuration
Before you can use either Sample or Production data, you must have already followed the database setup steps in the main README at the root of this repository.

You also need a `.env` file in `DegreeMap/Database`. This `.env` file requires the following data to be entered correctly:
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

## Sample
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
The script will automatically drop the entire existing database tables, recreate the tables, and take the data from the CSV files instead of the production API endpoints if you use the **sample** argument.

## Production
It is very straightforward to populate the Production data.
1. Navigate to the 'Database' directory.
```
cd DegreeMap/Database
```
2. Install the NPM packages. [Install Node and Npm](https://nodejs.org/en/download) if you haven't already before you do this step.
```
npm install
```
3. Ensure the `.env` file is correctly filled out based on the template at the beginning of this file. The script won't work without the `.env` file and token.
4. Run the data population script for the production data.
```
node PopulateData.js prod
```
The script will drop the entire existing database tables, recreate the tables, query the prod api, and re-populate the data.
