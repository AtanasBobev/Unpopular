const { Pool } = require("pg");
const pool = new Pool({
  user: "uhymwohquqvwjn",
  host: "ec2-99-81-177-233.eu-west-1.compute.amazonaws.com",
  database: "dcqdlqpu4ipem1",
  password: "cc1586e15a5d574d320f010e149e0ae741df93fe8e21b0061f2b00d481fd7336",
  port: "5432",
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.connect((err) => {
  if (err) {
    console.log("Error when setting up DB: " + err);
  } else {
    console.log("DB connected successfully!");
  }
});
module.exports = pool;
