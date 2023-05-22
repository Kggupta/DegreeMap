# FilmFlix

FilmFlix is a web application that will allow users to manage, rate, and analyse movies registered in the IMDB database. We will also include trivia features so that users can test themselves on how well they know the film industry. Our target demographic is people who are obsessed with finding and keeping track of their film catalogue. Our users are the kind of people who want to know everything about the industry and become critics.

We will use the [IMDB dataset](https://datasets.imdbws.com/) to download the Movie and Actor/Actress catalogues. 

# Team Members
- Keshav Gupta 
- Isshana Mohanakumar 
- Edward Pei 
- Ricky Lu
- Govind Nair

# Create a local instance of the database

FilmFlix uses a MySQL database.

1. Install MySQL server + workbench
2. Complete configuration steps
3. Enter the database shell

`mysql –u username -p password`

4. Create the database

`CREATE DATABASE filmflix_db;`

5. Use the database

`USE filmflix_db;`

# Populate Data

Only move onto this step once you complete the creation of a local instance of the database.

## Sample Data

```
cd Server
npm install
node sample-data.js
```

Navigate to your mysql database in a Terminal window and you will see the sample data!

## Production Data

Coming soon.