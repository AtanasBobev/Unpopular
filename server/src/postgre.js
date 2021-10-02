const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Unpopular_Bulgaria",
  password: "1234",
  port: "5432",
});
pool.connect((err) => {
  if (err) {
    console.log("Error when setting up DB: " + err);
  } else {
    console.log("DB connected successfully!");
  }
});
module.exports = pool;
