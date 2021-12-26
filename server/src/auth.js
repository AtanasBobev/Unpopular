const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { response } = require("express");
const pool = require("./postgre");
const generateToken = async (
  Username,
  Authorized,
  id,
  email,
  admin = false
) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();
  let token = await jwt.sign(
    {
      Username: Username,
      Authorized: Authorized,
      user_id: id,
      email: email,
      admin: admin,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90,
      randomEl: Math.random(),
    },
    privateKey
  );
  return token;
};
const authorizeToken = (req, res, next) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();
  if (req.headers.jwt == req.cookies.JWT) {
    res.status(401).send("Could not verify you!");
    return false;
  }
  try {
    let decoded2 = jwt.verify(req.cookies.JWT, privateKey);
    if (!decoded2.Authorized) {
      res.status(401).send("Could not verify you!");
    }
  } catch (err) {
    console.warn(err);
    res.status(401).send("Could not verify you!");
    return err;
  }
  try {
    let decoded = jwt.verify(req.headers.jwt, privateKey);
    req.user = decoded.Username;
    req.verified = decoded.Authorized;
    req.user_id = decoded.user_id;
    req.email = decoded.email;
    req.admin = decoded.admin;
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
let captcha = fs
  .readFileSync(path.resolve(__dirname, "./keys/captcha.key"))
  .toString();
let cookieSecret = fs
  .readFileSync(path.resolve(__dirname, "./keys/cookieSecret.key"))
  .toString();
const authorizeTokenFunc = (token, token2) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();

  try {
    let decoded = jwt.verify(token, privateKey);
    let decoded2 = jwt.verify(token2, privateKey);
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
const adminToken = async (req, res, next) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();

  try {
    let decoded = await jwt.verify(req.headers.jwt, privateKey);
    if (Boolean(decoded.admin)) {
      pool.query(
        "SELECT admin FROM users WHERE username=$1",
        [decoded.Username],
        (err, data) => {
          if (err) {
            res.status(500).send("Internal server error");
            return false;
          }
          if (!data.rows.length) {
            res.status(403).send("You are not an admin!");
            return false;
          }
          if (Boolean(data.rows[0].admin)) {
            req.user_id = Number(decoded.user_id);
            next();
          } else {
            res.status(403).send("You are not an admin!");
          }
        }
      );
    } else {
      res.status(401).send("Error with JWT");
    }
  } catch (err) {
    res.status(401).send("Error with JWT");
    return false;
  }
};
const adminTokenFunc = async (token) => {
  let privateKey = fs
    .readFileSync(path.resolve(__dirname, "./keys/jwt.key"))
    .toString();
  try {
    let decoded = await jwt.verify(token, privateKey);
    if (Boolean(decoded.admin)) {
      pool.query(
        "SELECT admin FROM users WHERE username=$1",
        [decoded.Username],
        (err, data) => {
          if (err) {
            console.log(err);
            return false;
          }
          if (!data.rows.length) {
            return false;
          }
          if (Boolean(data.rows[0].admin)) {
            return true;
          } else {
            return false;
          }
        }
      );
    } else {
      return false;
    }
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
  adminToken,
  adminTokenFunc,
  captcha,
  cookieSecret,
};
