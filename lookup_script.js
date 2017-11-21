const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

function printRow(row) {
  let dateOfBirth = row.birthdate.toISOString().slice(0,10);
  let printString = `- ${row.id}: ${row.first_name} ${row.last_name}, born '${dateOfBirth}'`;
  console.log(printString);
}

function printResultsTotal(result) {
  console.log(`Found ${result.rowCount} person(s) by the name '${searchParam}':`);
}

function queryDatabase(name) {
  client.query("SELECT * FROM famous_people WHERE first_name=$1 OR last_name=$1", [name], (err, result) => {
    console.log("Searching...");
    if (err) {
      return console.error("error running query", err);
    }
    printResultsTotal(result);

    result.rows.forEach(function(row) {
      printRow(row);
    });
    client.end();
  });
}

function searchForName(name) {
  client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
    queryDatabase(name);
  });
}

const searchParam = process.argv[2];

searchForName(searchParam);


