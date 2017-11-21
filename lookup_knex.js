const pg = require("pg");
const settings = require("./settings"); // settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  },
  searchPath: ['knex', 'public']
});

function printResults(results) {
  results.forEach(function(result) {
    let dateOfBirth = result.birthdate.toISOString().slice(0,10);
    let printString = `- ${result.id}: ${result.first_name} ${result.last_name}, born '${dateOfBirth}'`;
    console.log(printString);
  });
}

function printResultsTotal(result) {
  console.log(`Found ${result.length} person(s) by the name '${searchParam}':`);
}

function searchForName(name) {
  knex.select().from('famous_people')
    .where('first_name', name)
    .orWhere('last_name', name)
    .asCallback(function(err, rows) {
      console.log("Searching...");
      if (err) {
        return console.error("error running query", err);
      }
      printResultsTotal(rows);
      printResults(rows);
      knex.destroy();
    });
}

const searchParam = process.argv[2];

searchForName(searchParam);