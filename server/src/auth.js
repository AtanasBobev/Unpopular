const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const generateToken = async (Username, Authorized, id, email) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();
  let token = await jwt.sign(
    {
      Username: Username,
      Authorized: Authorized,
      user_id: id,
      email: email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    },
    privateKey
  );
  return token;
};
const authorizeToken = (req, res, next) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();
  try {
    let decoded = jwt.verify(req.headers.jwt, privateKey);
    req.user = decoded.Username;
    req.verified = decoded.Authorized;
    req.user_id = decoded.user_id;
    req.email = decoded.email;
    if (req.verified) {
      next();
    } else {
      res.status(401).send("Could not verify you!");
    }
  } catch (err) {
    console.warn(err);
    res.status(401).send("Could not verify you!");
    return err;
  }
};
const authorizeTokenFunc = (token) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();
  try {
    let decoded = jwt.verify(token, privateKey);
    return decoded;
  } catch (err) {
    return false;
  }
};
const isMailTemp = async (email) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/tempMail.key"))
    .toString();
  let data = await axios.get(
    `https://www.istempmail.com/api/check/${privateKey}/${email}`
  );
  return data.data.blocked;
};
let chosenIndex = 0;
const getWeatherKey = () => {
  try {
    let rawdata = fs.readFileSync(
      path.resolve(__dirname, "./keys/weatherKeys.json")
    );
    let data = JSON.parse(rawdata);
    if (chosenIndex !== data.keys.length - 1) {
      chosenIndex++;
    } else {
      chosenIndex = 0;
    }
    return data.keys[chosenIndex];
  } catch (err) {
    return false;
  }
};
module.exports = {
  authorizeToken,
  generateToken,
  authorizeTokenFunc,
  getWeatherKey,
  isMailTemp,
};
