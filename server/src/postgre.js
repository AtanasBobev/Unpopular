const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 24 * 60 * 60 * 1000,
  max: 10,
});
pool.connect((err) => {
  if (err) {
    console.log("Error when setting up DB: " + err);
  } else {
    console.log("DB connected successfully!");
  }
});
module.exports = pool;
