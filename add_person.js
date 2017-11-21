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

// Implement an add_person.js script that takes in the first name,
// last name and date of a famous person as three command line arguments
// and uses Knex to perform an insert.

const firstName = process.argv[2];
const lastName = process.argv[3];
const dateOfBirth = process.argv[4];

function prepareInput(firstname, lastname, dateofbirth) {
  let databaseEntry = {
    first_name: firstname,
    last_name: lastname,
    birthdate: dateofbirth
  };
  return databaseEntry;
}

function addPerson(firstname, lastname, dateofbirth) {
  knex.insert(prepareInput(firstname, lastname, dateofbirth))
    .into('famous_people')
    .then(function() {
      knex.destroy();
    });
}

addPerson(firstName, lastName, dateOfBirth);
