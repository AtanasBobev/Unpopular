const bcrypt = require("bcrypt");
const pool = require("./postgre");
let crypto = require("crypto");

async function encrypt(password) {
  const saltRounds = 15;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
}
const genToken = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

module.exports = { encrypt, genToken };
