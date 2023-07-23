# DegreeMap REST API

Currently, the API has no endpoints. They will be implemented in the next milestone.

# 1. Running The API
1. Navigate to this directory.
```
cd DegreeMap/server
```
2. [Install Node and Npm](https://nodejs.org/en/download) if you haven't already.
3. Copy the `.env` file you added to `DegreeMap/Database` into `DegreeMap/server` as well.
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
4. Install the NPM packages.
```
npm install
```
5. Start the server.
```
node index.js
```

# 2. Stopping the API
1. Use control + C in most systems.

# 3. Features

See the main `DegreeMap/README.md` and the report for the feature list, how to use the API, and which files correspond to which features.