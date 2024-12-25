const { Pool } = require('pg');

// Set up the connection to your database
const pool = new Pool({
  user: 'your_db_user',
  password: 'your_db_password',
  host: 'localhost',
  port: 5432,
  database: 'bootcampx'
});

// Get user inputs
const cohortName = process.argv[2];
const limit = process.argv[3] || 5;

// Parameterized query
const queryString = `
  SELECT students.id as student_id, students.name as name, cohorts.name as cohort
  FROM students
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  LIMIT $2;
`;

// Array of parameter values
const values = [`%${cohortName}%`, limit];

// Execute the query
pool.query(queryString, values)
  .then(res => {
    res.rows.forEach(user => {
      console.log(`${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort.`);
    });
  })
  .catch(err => console.error('query error', err.stack))
  .finally(() => pool.end());
