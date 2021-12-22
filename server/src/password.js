const bcrypt = require("bcrypt");
const pool = require("./postgre");
let crypto = require("crypto");
const moment = require("moment");

async function encrypt(password) {
  let r = moment().format("YY");
  if (r < 20) {
    r = 20;
  }
  const saltRounds = r;
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
