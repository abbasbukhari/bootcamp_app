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

// Parameterized query
const queryString = `
  SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
  FROM teachers
  JOIN assistance_requests ON teachers.id = assistance_requests.teacher_id
  JOIN students ON students.id = assistance_requests.student_id
  JOIN cohorts ON cohorts.id = students.cohort_id
  WHERE cohorts.name LIKE $1
  ORDER BY teacher;
`;

// Array of parameter values
const values = [`%${cohortName}%`];

// Execute the query
pool.query(queryString, values)
  .then(res => {
    res.rows.forEach(row => {
      console.log(`${row.teacher} assisted in the ${row.cohort} cohort.`);
    });
  })
  .catch(err => console.error('query error', err.stack))
  .finally(() => pool.end());
