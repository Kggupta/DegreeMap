# Getting Started with The User Interface

# 1. Important Note

In accordance with the following [piazza question](https://piazza.com/class/lhasib8a1jr59a/post/233) which asked if the use of UI templates is allowed for the project, the instructor indicated that this is allowed as long as we reference our source.

In that case, all credit in terms of the React Component template goes to [Material-UI](https://mui.com/) and [devias-io/material-kit-react](https://github.com/devias-io/material-kit-react) on GitHub, which are both under the MIT license, and intended to be available free of charge.

The template provides basic UI Components such as cards and text box CSS/HTML files.

# 2. Running The User Interface

1. Navigate to the client directory
```
cd DegreeMap/Client
```
2. Install Node and Npm.
```
https://nodejs.org/en/download
```
3. Copy the `.env` file you added to `DegreeMap/Database` into `DegreeMap/Client` as well.
```
TOKEN="YOUR API TOKEN FOR THE PROD DATA"
USERNAME="YOUR MYSQL USERNAME"
PASSWORD="YOUR MYSQL PASSWORD"
DATABASE_NAME="degreemap"
HOST="localhost"
PORT=3306
APIPORT=3030
SERVERURL="http://localhost:3030"
```
4. Install `yarn`.
```
npm install --global yarn
```
5. Install Dependencies.
```
yarn install
```
6. Start the Environment
```
yarn start
```
7. View the application in your browser.
```
http://localhost:3000
```
The page will reload when you make changes.\
You may also see any lint errors in the console.

# 3. Stopping the User Interface
1. Use control + C in most systems.

# 4. Features

See the main `DegreeMap/README.md` and the report for the feature list, how to use the application interface, and which files correspond to which features.