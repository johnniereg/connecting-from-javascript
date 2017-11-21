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

const searchParam = process.argv[2];


client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT * FROM famous_people WHERE first_name=$1 OR last_name=$1", [searchParam], (err, result) => {
    console.log("Searching...");
    if (err) {
      return console.error("error running query", err);
    }
    let resultsTotal = result.rowCount;
    console.log(`Found ${resultsTotal} person(s) by the name '${searchParam}':`);

    result.rows.forEach(function(row) {
      let dateOfBirth = row.birthdate.toISOString().slice(0,10);
      let printString = `- ${row.id}: ${row.first_name} ${row.last_name}, born '${dateOfBirth}'`;
      console.log(printString);
    });

    client.end();
  });
});