import mysql2 from 'mysql2'
import fs from 'fs'
import { parse } from 'csv-parse';
import readline from 'readline'
import { rejects } from 'assert';

const connection = mysql2.createConnection({
  host: 'localhost',
  port: 3306,
  database: 'filmflix_db',
  user: 'root',
  password: 'root123$'
});

function DeleteTables() {
  var deleteTableQueries = readline.createInterface({
    input: fs.createReadStream("../Database/DeleteTables.sql"),
    terminal: false
  });
    
  deleteTableQueries.on('line', function(chunk){
    connection.query(chunk.toString('ascii'));
  });
}

DeleteTables();

function CreateTables() {
  var createTableQueries = readline.createInterface({
    input: fs.createReadStream("../Database/CreateTables.sql"),
    terminal: false
   });
  
  createTableQueries.on('line', function(chunk){
    connection.query(chunk.toString('ascii'));
  });
}
setTimeout(() => CreateTables(), 1000);

function InsertSampleData() {
  fs.createReadStream("../Database/SampleData/MilestoneZeroSample.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    connection.query(
      `INSERT INTO m0_table VALUES (${parseInt(row[0])}, '${row[1]}', ${parseInt(row[2])}, ${parseInt(row[3])})`,
    );
  })
}

setTimeout(() => InsertSampleData(), 2000);
