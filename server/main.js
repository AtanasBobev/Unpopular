const express = require("express");
const {
  authorizeToken,
  generateToken,
  authorizeTokenFunc,
  getWeatherKey,
  isMailTemp,
  adminToken,
  adminTokenFunc,
  captcha,
  cookieSecret,
} = require("./src/auth");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const server = express();
const pool = require("./src/postgre");
const sendEmail = require("./src/email");
const bodyParser = require("body-parser");
const { encrypt, genToken } = require("./src/password");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mime = require("mime-types");
const moment = require("moment");
const format = require("pg-format");
const throttle = require("express-throttle");
const axios = require("axios");
const sanitizer = require("express-html-sanitizer");
const fs = require("fs");
const archive = require("simple-archiver").archive;
const sendMail = require("./src/email");
const isPointInBulgaria = require("./src/isPointInBulgaria");
const passwordValidator = require("password-validator");
const { verify } = require("hcaptcha");
const helmet = require("helmet");
config = {
  allowedTags: [],
  allowedAttributes: {},
  allowedIframeHostnames: [],
};
const secret = captcha;
const sanitizeReqBody = sanitizer(config);
const rateLimit = require("express-rate-limit");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.folder_upload,
  },
  allowedFormats: ["jpg", "png"],
});

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 150, // limit each IP to 150 requests per windowMs
  message:
    "Too many accounts created from this IP, please try again in a minute",
});
let schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf([
    "12345678",
    "123456789",
    "1234567890",
    "password",
    "qwerty123",
    "1234567890",
    "11111111",
    "iloveyou",
    "987654321",
    "superman",
    "iloveyou1",
    "Bulgaria",
    "bulgaria",
  ]);

const upload = multer({ storage: storage });

server.use(helmet());
server.use(cookieParser(cookieSecret));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json({ limit: "10kb" }));
server.use(
  cors({
    origin: [
      "https://unpopular-bulgaria.com",
      "https://unpopular-bulgaria.com",
      "https://www.unpopular-bulgaria.com",
      "www.unpopular-bulgaria.com",
      "unpopular-bulgaria.com",
    ],
    credentials: true,
  })
);
server.use(limiter);

server.use(sanitizeReqBody);
const hcverify = (req, res, next) => {
  if (!req.headers.token) {
    res.status(401).send("No or wrong captcha provided");
    return false;
  }
  verify(secret, req.headers.token)
    .then((data) => {
      if (data.success === true) {
        next();
      } else {
        res.status(401).send("No or wrong captcha provided");
        return false;
      }
    })
    .catch(() => {
      res.status(401).send("No or wrong captcha provided");
      return false;
    });
};

//Grouping function to be used by endpoints sending places. It groups similar objects based on a provided identical key
const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

server.get("/statsUser", (req, res) => {
  pool.query(
    `SELECT (SELECT COUNT(*) as users_count FROM users),
  (SELECT COUNT(*) as places FROM places),
  (SELECT COUNT(*) as comments FROM comments),
  (SELECT COUNT(*) as replies FROM comments_replies),
  (SELECT COUNT(*) as images FROM images),
  (SELECT COUNT(*) as likes FROM "favoritePlaces"),
  (SELECT COUNT(*) as saves FROM "savedPlaces")
  FROM users`,
    (err, data) => {
      if (err) {
        return false;
      }
      res.status(200).send(data.rows[0]);
    }
  );
});

//Admin endpoints
server.get("/admin/complains", adminToken, (req, res) => {
  let order = "DESC";
  if (req.query.order == 2) {
    order = "ASC";
  }
  pool.query(
    "SELECT * FROM reported_items WHERE priority=0 ORDER BY date " +
      order +
      " LIMIT $1",
    [req.query.limit],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return false;
      }
      res.status(200).send(data.rows);
    }
  );
});

server.get("/admin/featured/complains", adminToken, (req, res) => {
  let order = "priority";
  let position = " DESC";
  if (req.query.order == 2) {
    order = "date";
    position = " DESC";
  } else if (req.query.order == 3) {
    order = "date";
    position = " ASC";
  }
  pool.query(
    "SELECT * FROM reported_items WHERE priority>0 ORDER BY " +
      order +
      position +
      " LIMIT $1",
    [req.query.limit],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return false;
      }
      res.status(200).send(data.rows);
    }
  );
});

server.delete("/complain", adminToken, (req, res) => {
  pool.query(
    "DELETE FROM reported_items WHERE report_id=$1",
    [req.body.report_id],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return false;
      }
      res.status(200).send("Report successfully deleted");
    }
  );
});

server.put("/complain/score", adminToken, (req, res) => {
  pool.query(
    `UPDATE public.reported_items
    SET priority=$2
    WHERE report_id=$1`,
    [req.body.report_id, req.body.priority],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return false;
      }
      res.status(200).send("Report priority successfully changed");
    }
  );
});

server.get("/user/comments", adminToken, (req, res) => {
  pool.query(
    `SELECT PLACE_ID,
    "comments".USER_ID, avatar,
    users.username,
    "comments".score AS "comment_score",
    "comments"."content" AS "comment_content",
    COMMENTS_REPLIES."content" AS "reply_content",
    "comments".DATE AS "comment_date",
    "comments"."id" AS "comments_id",
    comments_replies."id" AS "replies_id",
    comments_replies.SCORE AS "reply_score",
    COMMENTS_REPLIES."date" AS "reply_date",
    (SELECT count(*) from comments_replies where relating="comments"."id") AS "replies_count",
    replies_actions.action AS "replies_actions",
    comments_actions.action AS "comments_actions"
  FROM "comments"
  LEFT JOIN COMMENTS_REPLIES ON COMMENTS_REPLIES.RELATING = "comments".ID
  LEFT JOIN users ON users.id = "comments".user_id
  LEFT JOIN replies_actions on replies_actions.user_id=$2 AND replies_actions."reply_id"=comments_replies."id"
  LEFT JOIN comments_actions on comments_actions.user_id=$2 AND comments_actions.comment_id="comments"."id"
  WHERE ("comments".visible=true OR comments_replies.visible=true) AND users.id=$2 AND comments.user_id=$2 ORDER BY comments.date DESC LIMIT $1`,
    [Number(req.query.limit), Number(req.query.id)],
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
        return false;
      }
      res.status(200).send(data.hasOwnProperty("rows") ? data.rows : "");
    }
  );
});
server.get("/user/replies", adminToken, (req, res) => {
  pool.query(
    `SELECT relating,
    "comments_replies".USER_ID, avatar,
    users.username,
    "comments_replies".score AS "comment_score",
    "comments_replies"."content" AS "comment_content",
    COMMENTS_REPLIES."content" AS "reply_content",
    "comments_replies".DATE AS "comment_date",
    "comments_replies"."id" AS "comments_id",
    replies_actions.action AS "replies_actions",
    replies_actions.action AS "comments_actions"
  FROM "comments_replies"
  LEFT JOIN users ON users.id = $2
  LEFT JOIN replies_actions ON replies_actions.user_id=$2 AND comments_replies."id"=replies_actions."action_id"
  WHERE comments_replies.user_id=$2
  ORDER BY "comments_replies".date  DESC LIMIT $1 `,
    [Number(req.query.limit), Number(req.query.id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      res.status(200).send(data.hasOwnProperty("rows") ? data.rows : "");
    }
  );
});

server.get("/users", adminToken, (req, res) => {
  pool.query(
    `SELECT DISTINCT username,email,users.date,verified,emailsent,users.id,avatar,locked,admin,
  (SELECT COUNT(*)  AS comments_count FROM comments WHERE user_id=users.id),
  (SELECT COUNT(*) AS upladed_places FROM places WHERE user_id=users.id),
  (SELECT COUNT(*) AS comments_replies_count FROM comments_replies WHERE user_id=users.id),
  (SELECT COUNT(*) AS favoritePlaces_count FROM "favoritePlaces" WHERE user_id=users.id),
  (SELECT COUNT(*) AS savedPlaces_count FROM "savedPlaces" WHERE user_id=users.id),
  (SELECT COUNT(*) AS replies_actions_count FROM "replies_actions" WHERE user_id=users.id)
  FROM users 
  LEFT JOIN places ON user_id=id
  LEFT JOIN comments ON comments.user_id=users.id
  LEFT JOIN comments_replies ON comments_replies.user_id=users.id
  LEFT JOIN "favoritePlaces" ON "favoritePlaces".user_id=users.id
  LEFT JOIN "savedPlaces" ON "savedPlaces".user_id=users.id
  LEFT JOIN replies_actions ON replies_actions.user_id=users.id
  ORDER BY users.date LIMIT $1`,
    [req.params.limit],
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return false;
      }
      res.status(200).send(data.rows);
    }
  );
});

server.get("/stats", adminToken, (req, res) => {
  pool.query(
    `SELECT 
  (SELECT COUNT(*) as users_count FROM users),
    (SELECT COUNT(*) as places FROM places),
    (SELECT COUNT(*) as comments FROM comments),
    (SELECT COUNT(*) as replies FROM comments_replies),
    (SELECT COUNT(*) as images FROM images),
    (SELECT COUNT(*) as likes FROM "favoritePlaces"),
    (SELECT COUNT(*) as saves FROM "savedPlaces"),
    (SELECT COUNT(*) as place_last_1day FROM places where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as place_last_3days FROM places where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as place_last_7days FROM places where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as place_last_14days FROM places where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as place_last_30days FROM places where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as place_last_3months FROM places where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as place_last_year FROM places where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as place_last_10year FROM places where "date" > now() - interval '10 year'),
    (SELECT COUNT(*) as favoritePlaces FROM "favoritePlaces"),
    (SELECT COUNT(*) as favoritePlaces_last_1day FROM "favoritePlaces" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as favoritePlaces_last_3days FROM "favoritePlaces" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as favoritePlaces_last_7days FROM "favoritePlaces" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as favoritePlaces_last_14days FROM "favoritePlaces" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as favoritePlaces_last_30days FROM "favoritePlaces" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as favoritePlaces_last_3months FROM "favoritePlaces" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as favoritePlaces_last_year FROM "favoritePlaces" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as favoritePlaces_last_10year FROM "favoritePlaces" where "date" > now() - interval '10 year'),
    (SELECT COUNT(*) as savedPlaces_last_1day FROM "savedPlaces" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as savedPlaces_last_3days FROM "savedPlaces" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as savedPlaces_last_7days FROM "savedPlaces" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as savedPlaces_last_14days FROM "savedPlaces" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as savedPlaces_last_30days FROM "savedPlaces" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as savedPlaces_last_3months FROM "savedPlaces" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as savedPlaces_last_year FROM "savedPlaces" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as savedPlaces_last_10year FROM "savedPlaces" where "date" > now() - interval '10 year'),
    (SELECT COUNT(*) as comments_last_1day FROM "comments" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as comments_last_3days FROM "comments" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as comments_last_7days FROM "comments" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as comments_last_14days FROM "comments" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as comments_last_30days FROM "comments" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as comments_last_3months FROM "comments" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as comments_last_year FROM "comments" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as comments_last_10year FROM "comments" where "date" > now() - interval '10 year'),
    (SELECT COUNT(*) as comments_replies FROM "comments_replies" ),
     (SELECT COUNT(*) as comments_replies_last_1day FROM "comments_replies" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as comments_replies_last_3days FROM "comments_replies" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as comments_replies_last_7days FROM "comments_replies" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as comments_replies_last_14days FROM "comments_replies" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as comments_replies_last_30days FROM "comments_replies" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as comments_replies_last_3months FROM "comments_replies" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as comments_replies_last_year FROM "comments_replies" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as comments_replies_last_10year FROM "comments_replies" where "date" > now() - interval '10 year'),
     (SELECT COUNT(*) as comments_actions_last_1day FROM "comments_actions" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as comments_actions_last_3days FROM "comments_actions" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as comments_actions_last_7days FROM "comments_actions" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as comments_actions_last_14days FROM "comments_actions" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as comments_actions_last_30days FROM "comments_actions" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as comments_actions_last_3months FROM "comments_actions" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as comments_actions_last_year FROM "comments_actions" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as comments_actions_last_10year FROM "comments_actions" where "date" > now() - interval '10 year'),
       (SELECT COUNT(*) as replies_actions_last_1day FROM "replies_actions" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as replies_actions_last_3days FROM "replies_actions" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as replies_actions_last_7days FROM "replies_actions" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as replies_actions_last_14days FROM "replies_actions" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as replies_actions_last_30days FROM "replies_actions" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as replies_actions_last_3months FROM "replies_actions" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as replies_actions_last_year FROM "replies_actions" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as replies_actions_last_10year FROM "replies_actions" where "date" > now() - interval '10 year'),
    (SELECT COUNT(*) as images_last_1day FROM "images" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as images_last_3days FROM "images" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as images_last_7days FROM "images" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as images_last_14days FROM "images" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as images_last_30days FROM "images" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as images_last_3months FROM "images" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as images_last_year FROM "images" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as images_last_10year FROM "images" where "date" > now() - interval '10 year'),
    (SELECT COUNT(*) as users_last_1day FROM "users" where "date" > now() - interval '1 day'),
    (SELECT COUNT(*) as users_last_3days FROM "users" where "date" > now() - interval '3 day'),
    (SELECT COUNT(*) as users_last_7days FROM "users" where "date" > now() - interval '7 day'),
    (SELECT COUNT(*) as users_last_14days FROM "users" where "date" > now() - interval '14 day'),
    (SELECT COUNT(*) as users_last_30days FROM "users" where "date" > now() - interval '30 day'),
    (SELECT COUNT(*) as users_last_3months FROM "users" where "date" > now() - interval '3 months'),
    (SELECT COUNT(*) as users_last_year FROM "images" where "date" > now() - interval '1 year'),
    (SELECT COUNT(*) as active_reports FROM "reported_items" ),
    (SELECT COUNT(*) as active_verification_actons FROM "verification_actions" ),
    (SELECT COUNT(*) as users_unverified FROM "users" WHERE verified='false' OR verified::boolean=null),
    (SELECT COUNT(*) as users_admins FROM "users" WHERE admin = true),
    (SELECT COUNT(*) as users_last_10years FROM "images" where "date" > now() - interval '10 year'),
    (SELECT COUNT(*) as locked_accounts FROM "users" WHERE locked=true)
    FROM users LIMIT 1`,
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      let ips = await pool.query(
        "SELECT * FROM login_attempts ORDER BY time DESC LIMIT 300"
      );
      res.status(200).send({ data: data.rows[0], ips: ips.rows });
    }
  );
});

server.get("/admin/comments", adminToken, (req, res) => {
  pool.query(
    `SELECT PLACE_ID,
    "comments".USER_ID, avatar,
    users.username,
    "comments".score AS "comment_score",
    "comments"."content" AS "comment_content",
    "comments".DATE AS "comment_date",
    "comments"."id" AS "comments_id",
    comments_actions.action AS "comments_actions"
  FROM "comments"
  LEFT JOIN users ON users.id = "comments".user_id
  LEFT JOIN comments_actions on comments_actions.user_id=comments.user_id AND comments_actions.comment_id="comments"."id"
  WHERE ("comments".visible=true) ORDER BY comments.date DESC LIMIT $1`,
    [Number(req.query.limit)],
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
        return false;
      }
      res.status(200).send(data.hasOwnProperty("rows") ? data.rows : "");
    }
  );
});

server.get("/admin/replies", adminToken, (req, res) => {
  pool.query(
    `SELECT relating,
    "comments_replies".USER_ID, avatar,
    users.username,
    "comments_replies".score AS "comment_score",
    "comments_replies"."content" AS "comment_content",
    COMMENTS_REPLIES."content" AS "reply_content",
    "comments_replies".DATE AS "comment_date",
    "comments_replies"."id" AS "comments_id",
    (SELECT count(*) from comments where place_id=place_id) AS "comments_count",
    replies_actions.action AS "replies_actions",
    replies_actions.action AS "comments_actions"
  FROM "comments_replies"
  LEFT JOIN users ON users.id = "comments_replies".user_id
  LEFT JOIN replies_actions on replies_actions.user_id=users.id AND replies_actions.reply_id=comments_replies.id
   ORDER BY "comments_replies".date DESC LIMIT $1 `,
    [Number(req.query.limit)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      res.status(200).send(data.hasOwnProperty("rows") ? data.rows : "");
    }
  );
});

server.post("/report", authorizeToken, (req, res) => {
  if (
    !(Number(req.body.item_id) &&
      Number(req.body.type) &&
      req.body.reason !== undefined,
    typeof req.body.reason == "string")
  ) {
    res.status(400).send("Incomplete data provided");
    return false;
  }
  pool.query(
    `INSERT INTO public.reported_items(item_id, type, reason, date, user_id,priority)
	VALUES ($1, $2, $3,$4,$5,0)`,
    [
      Number(req.body.item_id),
      req.body.type,
      req.body.reason.substring(0, 500),
      new Date(),
      Number(req.user_id),
    ],
    (err, data) => {
      if (err) {
        if (err.code == 23505) {
          res.status(409).send("Report already exists");
        } else {
          res.status(500).send("Internal server error");
        }
        return false;
      }
      res.status(200).send("Report submitted successfully");
    }
  );
});
server.post("/save", authorizeToken, (req, res) => {
  if (!req.body.place_id) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }
  if (!req.verified) {
    res.status(403).send("Your account is unauthorized! Verify your account!");
    return false;
  }
  pool.query(
    `INSERT INTO public."savedPlaces"(user_id, place_id, date) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [
      Number(req.user_id),
      Number(req.body.place_id),
      new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
    ],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (data.rowCount) {
        res.status(200).send("Place saved successfully!");
      } else {
        res.status(406).send("You already saved this place!");
      }
    }
  );
});

server.post("/unsave", authorizeToken, async (req, res) => {
  if (!req.body.place_id) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }
  if (!req.verified) {
    res.status(403).send("Your account is unauthorized! Verify your account!");
    return false;
  }
  let user_id = await authorizeTokenFunc(req.headers.jwt, req.cookies.JWT);
  user_id = user_id.user_id;
  pool.query(
    `DELETE FROM "savedPlaces" WHERE user_id=$1 AND place_id=$2`,
    [user_id, req.body.place_id],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (data.rowCount) {
        res.status(200).send("Place unsaved successfully!");
      } else {
        res.status(406).send("You haven't saved this place in the first place");
      }
    }
  );
});

server.get("/weather", (req, res) => {
  if (!(req.query.latitude && req.query.longtitude)) {
    res.status(400).send("Latitude and longtitude parameters are required!");
    return false;
  }
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${Number(
    req.query.latitude
  )}&lon=${Number(
    req.query.latitude
  )}&appid=${getWeatherKey()}&lang=en&units=metric`;
  axios
    .get(url)
    .then((data) => {
      res.status(200).send(data.data);
    })
    .catch((err) => {
      //
      res.status(500).send("Could not connect to the API!");
    });
});

server.post("/like", throttle({ rate: "5/s" }), authorizeToken, (req, res) => {
  if (!req.body.place_id) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }
  if (!req.verified) {
    res.status(403).send("Your account is unauthorized! Verify your account!");
    return false;
  }
  pool.query(
    "SELECT COUNT(*) FROM places WHERE user_id=$1 AND place_id = $2",
    [Number(req.user_id), req.body.place_id],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (Number(data.rows[0].count) == 0) {
        pool.query(
          `INSERT INTO public."favoritePlaces"(user_id, place_id, date) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [
            Number(req.user_id),
            Number(req.body.place_id),
            new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
              .toISOString()
              .replace("T", " ")
              .replace("Z", ""),
          ],
          (err, data) => {
            if (err) {
              res.status(500).send("Internal server error");
              return false;
            }
            if (data.rowCount) {
              res.status(200).send("Place liked successfully!");
            } else {
              res.status(406).send("You already liked this place!");
            }
          }
        );
      } else {
        res.status(403).send("You cannot like your own posts!");
      }
    }
  );
});

server.post(
  "/unlike",
  throttle({ rate: "5/s" }),
  authorizeToken,
  async (req, res) => {
    if (!req.body.place_id) {
      res.status(400).send("Not enough data was provided!");
      return false;
    }
    if (!req.verified) {
      res
        .status(403)
        .send("Your account is unauthorized! Verify your account!");
      return false;
    }
    let user_id = Number(req.user_id);

    pool.query(
      `DELETE FROM "favoritePlaces" WHERE user_id=$1 AND place_id=$2`,
      [user_id, req.body.place_id],
      (err, data) => {
        if (err) {
          res.status(500).send("Internal server error");
          return false;
        }
        if (data.rowCount) {
          res.status(200).send("Place unliked successfully!");
        } else {
          res.status(406).send("You don't like this place");
        }
      }
    );
  }
);

server.post("/search", throttle({ rate: "3/s" }), async (req, res) => {
  if (req.body.limit == undefined || req.body.offset == undefined) {
    res.status(400).send("Not enough data was provided.");
    return false;
  }
  let order = " DESC";
  let sortBy;
  switch (Number(req.body.sort)) {
    case 1:
      sortBy = "likednumber";
      order = " DESC";
      break;
    case 2:
      sortBy = "likednumber";
      order = " ASC";
      break;
    case 3:
      sortBy = "date";
      order = " DESC";
      break;
    case 4:
      sortBy = "date";
      order = " ASC";
      break;
    default:
      sortBy = "likednumber";
      order = " DESC";
  }

  if (
    req.body.limit < 0 ||
    req.body.limit > 1000000 ||
    req.body.offset < 0 ||
    req.body.offset > 1000000
  ) {
    res.status(400).send("Invalid data");
    return false;
  }
  let placelocation,
    placelocationFormat = "%s",
    category,
    categoryFormat,
    price,
    priceFormat,
    dangerous,
    dangerousFormat,
    accessibility,
    accessibilityFormat,
    user_id,
    userFormat = "%L";

  if (!req.body.location) {
    placelocation = "placelocation";
  } else {
    placelocationFormat = "%L";
    placelocation = req.body.location;
  }
  if (req.body.category == 1) {
    categoryFormat = "%s";
    category = "category";
  } else {
    categoryFormat = "%L";
    category = Number(req.body.category) - 1;
  }
  if (req.body.price == 1) {
    priceFormat = "%s";
    price = "price";
  } else {
    priceFormat = "%L";
    price = req.body.price;
  }
  if (req.body.dangerous == 1) {
    dangerousFormat = "%s";
    dangerous = "dangerous";
  } else {
    dangerousFormat = "%L";
    dangerous = req.body.dangerous;
  }
  if (req.body.accessibility == 1) {
    accessibilityFormat = "%s";
    accessibility = "accessibility";
  } else {
    accessibilityFormat = "%L";
    accessibility = req.body.accessibility;
  }

  if (req.headers.jwt && authorizeTokenFunc(req.headers.jwt, req.cookies.JWT)) {
    user_id = await authorizeTokenFunc(req.headers.jwt, req.cookies.JWT);
    user_id = user_id.user_id;
  } else {
    user_id = -1;
    userFormat = "%s";
  }
  let sql = format(
    `SELECT places.place_id,user_id,views,username,avatar,city,title,description,visible,score,placelocation,category,price,accessibility,places.date,dangerous,url,image_id,(SELECT COUNT(*) AS likednumber FROM "favoritePlaces" WHERE "favoritePlaces".place_id=places.place_id), CASE WHEN EXISTS (select * from "favoritePlaces" where "favoritePlaces".place_id = places.place_id AND user_id=` +
      userFormat +
      ` LIMIT  %s) THEN 'true' ELSE 'false' END AS liked, CASE WHEN EXISTS (select * from "savedPlaces" where "savedPlaces".place_id = places.place_id AND user_id=` +
      userFormat +
      ` LIMIT %s ) THEN 'true' ELSE 'false' END as saved FROM (SELECT *,(SELECT COUNT(*) AS LIKEDNUMBER
FROM "favoritePlaces"
WHERE "favoritePlaces".PLACE_ID = PLACES.PLACE_ID)
FROM PLACES ORDER BY ` +
      sortBy +
      " " +
      order +
      `, places.date ` +
      order +
      ` LIMIT %s OFFSET %s) places
LEFT JOIN users ON users.id = places.user_id
LEFT JOIN images ON images.place_id = places.place_id WHERE LOWER(description) SIMILAR TO  LOWER(Concat('%',%L,'%'))  AND LOWER(placelocation) = LOWER(` +
      placelocationFormat +
      ") AND category =" +
      categoryFormat +
      " AND price =" +
      priceFormat +
      " AND dangerous =" +
      dangerousFormat +
      " AND accessibility =" +
      accessibilityFormat +
      " OR  LOWER(title) SIMILAR TO LOWER(Concat('%',%L,'%'))  AND visible=true AND placelocation SIMILAR TO " +
      placelocationFormat +
      " AND category =" +
      categoryFormat +
      " AND price =" +
      priceFormat +
      " AND dangerous =" +
      dangerousFormat +
      " AND accessibility =" +
      accessibilityFormat +
      " ORDER BY " +
      sortBy +
      order,
    user_id,
    req.body.limit,
    user_id,
    req.body.limit,
    req.body.limit,
    req.body.offset,
    req.body.query,
    placelocation,
    category,
    price,
    dangerous,
    accessibility,
    req.body.query,
    placelocation,
    category,
    price,
    dangerous,
    accessibility
  );
  pool.query(sql, (err, data) => {
    if (err) {
      res.status(500).send("Internal server error.");
      return false;
    }
    let copyObj = data.rows;
    //Handle corrupted records
    for (const obj of copyObj) {
      if (obj.place_id === undefined || obj.place_id === null) {
        copyObj.place_id = Math.random();
      }
    }
    let final = groupBy(copyObj, "title");

    let finalArray = [];
    //Turn the newly created object of objects into an array of objects for front-end manipulation
    Object.keys(final).forEach(function (key) {
      finalArray.push(final[key]);
    });
    res.status(200).send(finalArray);
  });
});

server.post("/searchCount", async (req, res) => {
  let placelocation,
    placelocationFormat = "%s",
    category,
    categoryFormat,
    price,
    priceFormat,
    dangerous,
    dangerousFormat,
    accessibility,
    accessibilityFormat,
    user_id;
  if (!req.body.location) {
    placelocation = "placelocation";
  } else {
    placelocationFormat = "%L";
    placelocation = req.body.location;
  }
  if (req.body.category == 1) {
    categoryFormat = "%s";
    category = "category";
  } else {
    categoryFormat = "%L";
    category = Number(req.body.category) - 1;
  }
  if (req.body.price == 1) {
    priceFormat = "%s";
    price = "price";
  } else {
    priceFormat = "%L";
    price = req.body.price;
  }
  if (req.body.dangerous == 1) {
    dangerousFormat = "%s";
    dangerous = "dangerous";
  } else {
    dangerousFormat = "%L";
    dangerous = req.body.dangerous;
  }
  if (req.body.accessibility == 1) {
    accessibilityFormat = "%s";
    accessibility = "accessibility";
  } else {
    accessibilityFormat = "%L";
    accessibility = req.body.accessibility;
  }
  let sql = format(
    `SELECT COUNT(*) as row_count FROM
  (SELECT *
   FROM places
  ) places WHERE LOWER(description) 
        SIMILAR TO  LOWER(Concat('%',%L,'%'))  AND LOWER(placelocation) = LOWER(` +
      placelocationFormat +
      ") AND category =" +
      categoryFormat +
      " AND price =" +
      priceFormat +
      " AND dangerous =" +
      dangerousFormat +
      " AND accessibility =" +
      accessibilityFormat +
      " OR  LOWER(title) SIMILAR TO LOWER(Concat('%',%L,'%'))  AND visible=true AND placelocation SIMILAR TO " +
      placelocationFormat +
      " AND category =" +
      categoryFormat +
      " AND price =" +
      priceFormat +
      " AND dangerous =" +
      dangerousFormat +
      " AND accessibility =" +
      accessibilityFormat,
    req.body.query,
    placelocation,
    category,
    price,
    dangerous,
    accessibility,
    req.body.query,
    placelocation,
    category,
    price,
    dangerous,
    accessibility
  );
  pool.query(sql, (err, data) => {
    if (err) {
      res.status(500).send("Internal server error");
      return false;
    }
    res.status(200).send({ count: Number(data.rows[0].row_count) });
  });
});

server.get("/count", authorizeToken, (req, res) => {
  pool.query(
    "SELECT COUNT(*) FROM places WHERE user_id=$1",
    [Number(req.user_id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send(data.rows[0].count);
    }
  );
});

server.get("/image/:image", (req, res) => {
  if (req.params.image == undefined) {
    res.status(400).send("Не сте посочили файл");
    return false;
  }
  res.sendFile("/uploads/" + req.params.image, { root: __dirname }, () => {});
});

server.post("/places/views", throttle({ rate: "2/s" }), (req, res) => {
  if (typeof Number(req.body.place_id) !== "number") {
    res.status(400).send("Not enough data provided");
    return false;
  }
  pool.query(
    `UPDATE places 
  SET views = views + 1
WHERE place_id = $1`,
    [req.body.place_id],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send("Done");
    }
  );
});

server.get("/places/liked/saved", authorizeToken, (req, res) => {
  if (!req.query.place_id) {
    res.status(400).send("Invalid data");
    return false;
  }
  pool.query(
    `SELECT 
    CASE WHEN EXISTS (select * from "favoritePlaces" where "favoritePlaces".place_id = $2 AND user_id=$1)
        THEN 'true' ELSE 'false' END AS liked,
    CASE WHEN EXISTS (select * from "savedPlaces" where "savedPlaces".place_id = $2 AND user_id=$1)
        THEN 'true' ELSE 'false' END AS saved,views,
        (SELECT COUNT(*) AS LIKEDNUMBER
        FROM "favoritePlaces"
        WHERE "favoritePlaces".PLACE_ID = $2),views
        FROM PLACES
        JOIN "savedPlaces" ON PLACES.PLACE_ID = "savedPlaces".PLACE_ID
        JOIN "favoritePlaces" ON PLACES.PLACE_ID = "favoritePlaces".PLACE_ID
        LEFT JOIN users ON users.id = places.user_id
        WHERE "savedPlaces".USER_ID = $1  ORDER BY "savedPlaces".date DESC`,
    [Number(req.user_id), req.query.place_id],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send(data.rows ? data.rows[0] : "");
    }
  );
});

server.post(
  "/place",
  throttle({ rate: "2/s" }),
  hcverify,
  authorizeToken,
  upload.array("images", 5),
  (req, res) => {
    let imagesSrc = req.files.map((file) => [file.path, file.filename]);
    if (
      !(
        req.body.name &&
        req.body.description &&
        req.body.city &&
        req.body.category &&
        req.body.price &&
        req.body.accessibility &&
        req.body.dangerous &&
        req.body.location
      )
    ) {
      res.status(400).send("Incomplete data sent!");
      return false;
    }
    if (req.verified !== true) {
      res.status(401).send("Account not authorized");
      return false;
    }
    if (
      !isPointInBulgaria(
        req.body.location.replace(/\s+/g, "").split(",")[0],
        req.body.location.replace(/\s+/g, "").split(",")[1]
      )
    ) {
      res.status(400).send("Place is not in Bulgaria!");
      return false;
    }
    pool.query(
      "INSERT INTO places (user_id, title, description, visible, score, placelocation, category, price, accessibility, date, dangerous,city,views) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)",
      [
        Number(req.user_id),
        req.body.name,
        req.body.description,
        true,
        0,
        req.body.location,
        req.body.category,
        req.body.price,
        req.body.accessibility,
        new Date(),
        req.body.dangerous,
        req.body.city,
        0,
      ],
      (err) => {
        if (err) {
          if (err.code == 23505) {
            res.status(409).send("Place already exists");
            return false;
          }

          res.status(500).send("Internal server error");
          return false;
        }
        res.status(200).send("Place inserted successfully!");
        pool.query(
          "SELECT place_id FROM places WHERE title=$1",
          [req.body.name],
          (err, data) => {
            if (err) {
              return false;
            }
            imagesSrc.forEach((el) => {
              pool.query(
                "INSERT INTO images (place_id,url,public_id,date) VALUES ($1,$2,$3,$4)",
                [data.rows[0].place_id, el[0], el[1], new Date()],
                (err) => {
                  if (err) {
                    console.log(err, el[0], el[1]);
                    return false;
                  }
                }
              );
            });
          }
        );
      }
    );
  }
);

server.put(
  "/place",
  authorizeToken,
  throttle({ rate: "2/s" }),
  upload.array("images", 5),
  hcverify,
  async (req, res) => {
    let imagesSrc = req.files.map((file) => [file.path, file.filename]);
    if (
      !(
        req.body.name &&
        req.body.description &&
        req.body.city &&
        req.body.category &&
        req.body.price &&
        req.body.accessibility &&
        req.body.dangerous &&
        req.body.location &&
        req.body.place_id &&
        req.body.newImages
      )
    ) {
      res.status(400).send("Incomplete data sent!");
      return false;
    }
    //Verify that the user owns the place
    let owns = await pool.query(
      "SELECT COUNT(*) FROM places WHERE user_id=$1 AND place_id=$2",
      [Number(req.user_id), req.body.place_id]
    );
    let b = await !adminTokenFunc(req.headers.jwt);
    if (!Number(owns.rows[0].count) && b) {
      res.status(403).send("You do not own this place!");
      return false;
    }
    pool.query(
      "UPDATE places SET title=$1, description=$2, placelocation=$3, category=$4, price=$5, accessibility=$6, dangerous=$7,city=$8 WHERE place_id=$9",
      [
        req.body.name,
        req.body.description,
        req.body.location,
        req.body.category,
        req.body.price,
        req.body.accessibility,
        req.body.dangerous,
        req.body.city,
        req.body.place_id,
      ],
      (err, data) => {
        if (err) {
          res.status(500).send("Internal server error");
          return false;
        }
        res.status(200).send("Place updated successfully!");
        pool.query(
          "SELECT place_id FROM places WHERE title=$1",
          [req.body.name],
          async (err, data) => {
            if (err) {
              return false;
            }
            //Check if there are new images
            if (req.body.newImages == "true") {
              //Delete the old images from the filesystem
              let images = await pool.query(
                "SELECT url,public_id FROM images WHERE place_id=$1",
                [req.body.place_id]
              );
              //Remove all the images related to the place if there are any
              if (images.rows.length) {
                images.rows.forEach((el) => {
                  cloudinary.uploader.destroy(el.public_id, function (result) {
                    console.log(result);
                  });
                });
              }
              //Delete the old images from the database
              await pool.query("DELETE FROM images WHERE place_id=$1", [
                req.body.place_id,
              ]);
              //Upload the new images/if none, the forEach would be skipped
              imagesSrc.forEach((el) => {
                pool.query(
                  "INSERT INTO images (place_id,url,public_id,date) VALUES ($1,$2,$3,$4)",
                  [req.body.place_id, el[0], el[1], new Date()],
                  (err) => {
                    if (err) {
                      return false;
                    }
                  }
                );
              });
            }
          }
        );
      }
    );
  }
);
server.put("/place/suggest", authorizeToken, hcverify, async (req, res) => {
  if (
    !(
      req.body.name &&
      req.body.description &&
      req.body.city &&
      req.body.category &&
      req.body.price &&
      req.body.accessibility &&
      req.body.dangerous &&
      req.body.location &&
      req.body.place_id
    )
  ) {
    res.status(400).send("Incomplete data sent!");
    return false;
  }
  if (req.verified !== true) {
    res.status(401).send("Account not authorized");
    return false;
  }
  if (
    !isPointInBulgaria(
      req.body.location.replace(/\s+/g, "").split(",")[0],
      req.body.location.replace(/\s+/g, "").split(",")[1]
    )
  ) {
    res.status(400).send("Place is not in Bulgaria!");
    return false;
  }
  pool.query(
    `INSERT INTO public.suggested_places(
      place_id, title, description, placelocation, category, price, accessibility, city, dangerous, suggested_user_id, created_user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      req.body.place_id,
      req.body.name,
      req.body.description,
      req.body.location,
      req.body.category,
      req.body.price,
      req.body.accessibility,
      req.body.city,
      req.body.dangerous,
      Number(req.user_id),
      req.body.user_id,
    ],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return false;
      }
      let emailQuery = await pool.query("SELECT email from users where id=$1", [
        req.body.user_id,
      ]);
      sendMail(
        `Предложение`,
        `Направено бе предложение за редакция на едно от местата, което Вие сте създали с име ${req.body.name}. Влезнете в профила си, за да одобрите или премахнете промяната: https://unpopular-bulgaria.com`,
        emailQuery.rows[0].email
      );
      res.status(200).send("Place suggested successfully!");
    }
  );
});

server.delete("/place/suggested/rejected", authorizeToken, async (req, res) => {
  if (!req.body.suggestions_id) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  await pool.query("DELETE FROM suggested_places WHERE id=$1", [
    req.body.suggestions_id,
  ]);
  res.status(200).send("Suggestion deleted successfully");
});

server.post("/place/suggested/accepted", authorizeToken, (req, res) => {
  if (
    !(
      req.body.place_id ||
      req.body.suggestions_id ||
      req.body.suggested_user_id
    )
  ) {
    res.status(400).send("Not enough information was given");
    return false;
  }
  pool.query(
    `SELECT COUNT(*) FROM suggested_places JOIN places ON places.place_id=suggested_places.place_id WHERE suggested_places.place_id=$1 AND created_user_id=$2 AND suggested_places.id=$3 `,
    [req.body.place_id, Number(req.user_id), req.body.suggestions_id],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (!Number(data.rows[0].count)) {
        res.status(403).send("You do not have access to accept these changes");
        return false;
      }
      await pool.query(
        `UPDATE places SET title=suggested_places.title, description=suggested_places.description, placelocation=suggested_places.placelocation, category=suggested_places.category,price=suggested_places.price,accessibility=suggested_places.accessibility,city=suggested_places.city,dangerous=suggested_places.dangerous
FROM suggested_places
WHERE places.place_id=suggested_places.place_id AND suggested_places.id=$1`,
        [req.body.suggestions_id]
      );
      res.status(200).send("Place update successfully");

      let emailQuery = await pool.query(
        "SELECT email from users JOIN suggested_places on suggested_user_id=users.id where suggested_places.id=$1",
        [req.body.suggestions_id]
      );
      pool.query("DELETE FROM suggested_places WHERE id=$1", [
        req.body.suggestions_id,
      ]);
      sendMail(
        `Редакцията беше одобрена`,
        `Редакцията на място със заглавие е ${req.body.title} одобрено`,
        emailQuery.rows[0].email
      );
    }
  );
});

server.get("/place/suggested", authorizeToken, async (req, res) => {
  pool.query(
    `SELECT places.place_id,places.title,views,places.description,places.placelocation,places.category,places.price,places.accessibility,places.dangerous,places.city,places.dangerous,places.user_id,suggested_places.title as "suggested_places_title",suggested_places.description AS "suggested_places_description",suggested_places.placelocation AS "suggested_places_placelocation",suggested_places.category AS "suggested_places_category",suggested_places.category AS "suggested_places_category", suggested_places.price AS "suggested_places_price", suggested_places.accessibility AS "suggested_places_accessibility", suggested_places.city AS "suggested_places_city", suggested_places.dangerous AS "suggested_places_dangerous",suggested_places.id,suggested_places.suggested_user_id FROM places 
    JOIN suggested_places ON places.place_id=suggested_places.place_id
    WHERE user_id=$1 AND created_user_id=$1 LIMIT 999`,
    [Number(req.user_id)],
    (err, data) => {
      if (err) {
        res.status(500);
        return false;
      }
      res.status(200).send(data.rows);
    }
  );
});

server.get("/comment", adminToken, (req, res) => {
  pool.query(
    `SELECT PLACE_ID,
    "comments".USER_ID, avatar,
    users.username,
    "comments".score AS "comment_score",
    "comments"."content" AS "comment_content",
    COMMENTS_REPLIES."content" AS "reply_content",
    "comments".DATE AS "comment_date",
    "comments"."id" AS "comments_id",
    comments_replies."id" AS "replies_id",
    comments_replies.SCORE AS "reply_score",
    COMMENTS_REPLIES."date" AS "reply_date",
    (SELECT count(*) from comments_replies where relating="comments"."id") AS "replies_count",
    replies_actions.action AS "replies_actions",
    comments_actions.action AS "comments_actions"
  FROM "comments"
  LEFT JOIN COMMENTS_REPLIES ON COMMENTS_REPLIES.RELATING = "comments".ID
  LEFT JOIN users ON users.id = "comments".user_id
  LEFT JOIN replies_actions on replies_actions.user_id=$2 AND replies_actions."reply_id"=comments_replies."id"
  LEFT JOIN comments_actions on comments_actions.user_id=$2 AND comments_actions.comment_id="comments"."id"
  WHERE ("comments".visible=true OR comments_replies.visible=true) AND comments.id=$1 ORDER BY comments.date DESC LIMIT 1`,
    [req.query.id, req.user_id],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send(data.rows[0]);
    }
  );
});

server.get("/replyData", adminToken, (req, res) => {
  pool.query(
    `	SELECT content,comments_replies.date,avatar,score,comments_replies.user_id,comments_replies.id,username,replies_actions.action AS "replies_actions"
    FROM comments_replies
    JOIN users ON users.id=user_id
    LEFT JOIN replies_actions on replies_actions.user_id=$2 AND replies_actions."reply_id"=comments_replies."id"
     WHERE comments_replies.id=$1`,
    [req.query.id, req.user_id],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send(data.rows[0]);
    }
  );
});

server.delete("/place", authorizeToken, async (req, res) => {
  if (!req.body.place_id) {
    res.status(400);
    return false;
  }
  //Check if the user has access to modify the place in any way(is he the owner)
  let allowedQuery = await pool.query(
    "SELECT COUNT(*) FROM places WHERE place_id=$1 AND user_id=$2",
    [req.body.place_id, Number(req.user_id)]
  );
  let b = await !adminTokenFunc(req.headers.jwt);
  if (!Number(allowedQuery.rows[0].count) && b) {
    res.status(403).send("You do not own this place");
    return false;
  }
  //After the previous if, the user has accesss
  //Get all the images related to the place
  let images = await pool.query(
    "SELECT url,public_id FROM images WHERE place_id=$1",
    [req.body.place_id]
  );
  //Remove all the images related to the place if there are any
  if (images.rows.length) {
    images.rows.forEach((el) => {
      cloudinary.uploader.destroy(el.public_id, function (result) {
        console.log(result);
      });
    });
  }
  //Remove the images references on the database
  await pool.query("DELETE FROM images WHERE place_id=$1", [req.body.place_id]);
  //Get the comments associated with the place
  let comments_ids = await pool.query(
    "SELECT id FROM comments WHERE place_id=$1",
    [req.body.place_id]
  );
  //Delete these comments if there are any
  if (comments_ids.rows.length !== 0) {
    comments_ids.rows.forEach(async (el) => {
      //Delete the actions for the comments
      await pool.query("DELETE FROM replies_actions WHERE comment_id=$1", [
        el.id,
      ]);
      await pool.query("DELETE FROM comments_replies WHERE relating=$1", [
        el.id,
      ]);
      await pool.query("DELETE FROM comments_actions WHERE comment_id=$1", [
        el.id,
      ]);
    });
  }
  res.status(200).send("Place deleted");

  setTimeout(async () => {
    await pool.query("DELETE FROM notes WHERE place_id=$1", [
      req.body.place_id,
    ]);
    await pool.query("DELETE FROM comments WHERE place_id=$1", [
      req.body.place_id,
    ]);
    await pool.query(`DELETE FROM "savedPlaces" WHERE place_id=$1`, [
      req.body.place_id,
    ]);
    await pool.query(`DELETE FROM "favoritePlaces" WHERE place_id=$1`, [
      req.body.place_id,
    ]);
    await pool.query(
      "DELETE FROM reported_items WHERE item_id=$1 AND type='place'",
      [req.body.place_id]
    );
    await pool.query("DELETE FROM places WHERE place_id=$1", [
      req.body.place_id,
    ]);
  }, 2000);
});
server.get("/place/data/:id", (req, res) => {
  if (!Number(req.params.id)) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  pool.query(
    `SELECT *,url,username,avatar
FROM places
LEFT JOIN images on images.place_id = places.place_id
LEFT JOIN users ON users.id = places.user_id
WHERE places.PLACE_ID = $1 
`,
    [Number(req.params.id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      const category = (num) => {
        switch (Number(num)) {
          case 2:
            return "Заведение";
            break;
          case 3:
            return "Нощно заведение";
            break;
          case 4:
            return "Магазин";
            break;
          case 5:
            return "Пътека";
            break;
          case 6:
            return "Място";
            break;
          case 7:
            return "Друго";
            break;
          default:
            return "Без категория";
        }
      };
      const price = (num) => {
        switch (Number(num)) {
          case 2:
            return "Ниска";
            break;
          case 3:
            return "Нормална";
            break;
          case 4:
            return "Висока";
            break;
          default:
            return "Без определение";
        }
      };
      const accessibility = (num) => {
        switch (Number(num)) {
          case 2:
            return "Достъп с инвалидни колички";
            break;
          case 3:
            return "Леснодостъпно";
            break;
          case 4:
            return "Средно трудно";
            break;
          case 5:
            return "Труднодостъпно";
            break;
          default:
            return "Без определение";
        }
      };
      const dangerous = (num) => {
        switch (Number(num)) {
          case 2:
            return "Не е опасно";
            break;
          case 3:
            return "Малко опасно";
            break;
          case 4:
            return "Висока опасност";
            break;
          default:
            return "Без дефиниция";
        }
      };
      const finalData = {
        title: data.rows[0].title,
        description: data.rows[0].description,
        geographic_location: data.rows[0].placelocation,
        category: category(Number(data.rows[0].category)),
        price: price(Number(data.rows[0].price)),
        accessibility: accessibility(Number(data.rows[0].accecssibility)),
        dangerous: dangerous(Number(data.rows[0].dangerous)),
        date: data.rows[0].date,
        images_urls: data.rows.length
          ? data.rows.map((el) => el.url)
          : "No image data",
      };
      const json = JSON.stringify(finalData);
      const filename = `${data.rows[0].place_id}_Unpopular.json`;
      const mimetype = "application/json";
      res.setHeader("Content-Type", mimetype);
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.send(json);
    }
  );
});

server.get("/all/notes", authorizeToken, (req, res) => {
  pool.query(
    "SELECT notes AS Записка,title AS Заглавие FROM notes JOIN places ON places.place_id = notes.place_id WHERE notes.user_id=$1",
    [req.user_id],
    async (err, result) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      let data = JSON.stringify({ Записки: [result.rows] });
      res.send(data).status(200);
    }
  );
});

server.get("/user/data", authorizeToken, async (req, res) => {
  let userPlaces = await pool.query(
    `SELECT note,places.user_id,email,places.place_id,title,description,visible,score,placelocation,category,price,accessibility,places.date,city,dangerous,url,username,avatar
    FROM places
    LEFT JOIN images on images.place_id = places.place_id
    LEFT JOIN notes on notes.place_id = places.place_id
    JOIN users on id=places.user_id
    WHERE places.user_id = $1`,
    [Number(req.user_id)]
  );

  let data = groupBy(userPlaces.rows, "title");
  data = Object.keys(data).map((key) => data[key]);
  if (!data.length) {
    res.status(200).send("You have no saved data");
    return false;
  }
  const category = (num) => {
    switch (Number(num)) {
      case 1:
        return "Сграда";
        break;
      case 2:
        return "Гледка";
        break;
      case 3:
        return "Екотуризъм";
        break;
      case 4:
        return "Изкуство";
        break;
      case 5:
        return "Заведение";
        break;
      case 6:
        return "Друго";
        break;
      default:
        return "Без категория";
    }
  };
  const price = (num) => {
    switch (Number(num)) {
      case 1:
        return "Не се отнася";
        break;
      case 2:
        return "Ниска";
        break;
      case 3:
        return "Нормална";
        break;
      case 4:
        return "Висока";
        break;
      default:
        return "Без определение";
    }
  };
  const accessibility = (num) => {
    switch (Number(num)) {
      case 2:
        return "Достъп с инвалидни колички";
        break;
      case 3:
        return "Леснодостъпно";
        break;
      case 4:
        return "Средно трудно";
        break;
      case 5:
        return "Труднодостъпно";
        break;
      default:
        return "Без определение";
    }
  };
  const dangerous = (num) => {
    switch (Number(num)) {
      case 1:
        return "Не е опасно";
        break;
      case 2:
        return "Малко опасно";
        break;
      case 3:
        return "Висока опасност";
        break;
      default:
        return "Без дефиниция";
    }
  };
  let notes = await pool.query(
    "SELECT note,title from notes JOIN places ON places.place_id = notes.place_id  WHERE notes.user_id=$1",
    [req.user_id]
  );
  let archivedData = await Promise.all(
    data.map(async (el) => {
      const finalData = {
        title: el[0].title,
        description: el[0].description,
        geographic_location: el[0].placelocation,
        category: category(Number(el[0].category)),
        price: price(Number(el[0].price)),
        accessibility: accessibility(Number(el[0].accecssibility)),
        dangerous: dangerous(Number(el[0].dangerous)),
        date: el[0].date,
        note: el[0].note ? el[0].note : "",
        url: el[0].url
          ? el.map((url) => url.url)
          : "Не сте качили снимки за това място",
      };
      return {
        data: JSON.stringify(finalData),
        name: `${el[0].title}.json`,
      };
    })
  );

  data.forEach((el) => {
    el.map((image) => {
      archivedData.push({
        data: image.url,
        type: "file",
        name: "ImageUrl.json",
      });
    });
  });

  let name = `${Math.round(Math.random() * 10000)}.zip`;
  await archive(archivedData, {
    format: "zip",
    output: name,
  });
  res.status(200).sendFile(`${__dirname}/${name}`);
});

server.get("/user/preview", (req, res) => {
  if (!req.query.username && !req.query.user_id) {
    res.status(400).send("Invalid data");
    return false;
  }
  if (!Number(req.query.user_id)) {
    req.query.user_id = 0;
  }
  if (typeof req.query.username !== "string") {
    req.query.username = "";
  }
  pool.query(
    `SELECT COUNT(*),(SELECT avatar FROM users WHERE username=$1 OR id=$2),(SELECT username FROM users WHERE username=$1 OR id=$2) FROM places
    LEFT JOIN users on users.id=places.user_id
    WHERE username=$1 OR id=$2`,
    [req.query.username, req.query.user_id],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send(data.rows[0]);
    }
  );
});

server.get("/place/specific", async (req, res) => {
  if (!Number(req.query.place_id)) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  let user_format = "%L",
    user_id;

  if (req.headers.jwt && authorizeTokenFunc(req.headers.jwt, req.cookies.JWT)) {
    user_id = await authorizeTokenFunc(req.headers.jwt, req.cookies.JWT);
    user_id = user_id.user_id;
  } else {
    user_id = -1;
    userFormat = "%s";
  }

  let sql = format(
    `SELECT PLACES.PLACE_ID,
	places.user_id,
	TITLE,
	DESCRIPTION,
	VISIBLE,
	SCORE,
	PLACELOCATION,
	CATEGORY,
	PRICE,
	ACCESSIBILITY,
	PLACES.DATE,
	DANGEROUS,
	URL, username,avatar,views,
	IMAGE_ID,
	(SELECT COUNT(*) AS LIKEDNUMBER
		FROM "favoritePlaces"
		WHERE "favoritePlaces".PLACE_ID = $1), CASE
																																																										WHEN EXISTS
																																																																(SELECT *
																																																																	FROM "favoritePlaces"
																																																																	WHERE "favoritePlaces".PLACE_ID = $1
																																																																		AND USER_ID = ${user_format}
																																																																	) THEN 'true'
																																																										ELSE 'false'
																																																						END AS LIKED,
	CASE
					WHEN EXISTS
											(SELECT *
												FROM "savedPlaces"
												WHERE "savedPlaces".PLACE_ID = PLACES.PLACE_ID
													AND USER_ID = ${user_format}
) THEN 'true'
					ELSE 'false'
	END AS SAVED
FROM
	(SELECT *,
			(SELECT COUNT(*) AS LIKEDNUMBER
				FROM "favoritePlaces"
				WHERE "favoritePlaces".PLACE_ID = $1)
		FROM PLACES
		ORDER BY LIKEDNUMBER DESC, PLACES.DATE DESC) PLACES
LEFT JOIN IMAGES ON IMAGES.PLACE_ID = PLACES.PLACE_ID
LEFT JOIN users ON users.id = places.user_id
WHERE places.place_id=$1`,
    user_id,
    user_id
  );
  pool.query(sql, [Number(req.query.place_id)], (err, data) => {
    if (err) {
      res.status(500).send("Internal server error");
      return false;
    }
    let final = groupBy(data.rows, "title");
    let finalArray = [];
    //Turn the newly created object of objects into an array of objects for front-end manipulation
    Object.keys(final).forEach(function (key) {
      finalArray.push(final[key]);
    });
    res.status(200).send(finalArray);
  });
});

server.get("/user/achievments", authorizeToken, (req, res) => {
  pool.query(
    `SELECT date,(SELECT COUNT(*) AS "places_count" FROM places WHERE user_id=$1), (SELECT COUNT(*)  AS "comments_count" FROM comments WHERE user_id=$1), (SELECT COUNT(*) AS  "replies_count" FROM comments_replies WHERE user_id=$1) from users WHERE id=$1`,
    [Number(req.user_id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      res.status(200).send(data.rows);
    }
  );
});

server.get("/userLikedPlaces", authorizeToken, (req, res) => {
  if (Number(req.query.limit) < 0 || Number(req.query.limit) > 1000000) {
    res.status(400).send("Invalid LIMIT sent");
    return false;
  }
  pool.query(
    `SELECT PLACES.PLACE_ID, city,avatar,username,
    places.user_id,
    TITLE,
    DESCRIPTION,
    VISIBLE,
    SCORE,
    PLACELOCATION,
    CATEGORY,
    PRICE,
    ACCESSIBILITY,
    PLACES.DATE,
    DANGEROUS,
    URL,views,
    IMAGE_ID,
   CASE WHEN EXISTS (select * from "favoritePlaces" where "favoritePlaces".place_id = places.place_id AND user_id=$1)
THEN 'true' ELSE 'false' END AS liked,
CASE WHEN EXISTS (select * from "savedPlaces" where "savedPlaces".place_id = places.place_id AND user_id=$1) THEN 'true' 
ELSE 'false' END as saved,
    (SELECT COUNT(*) AS LIKEDNUMBER
      FROM "favoritePlaces"
      WHERE "favoritePlaces".PLACE_ID = PLACES.PLACE_ID ),
    (SELECT COUNT(USER_ID)
      FROM "savedPlaces"
       WHERE "savedPlaces".PLACE_ID = PLACES.PLACE_ID)
  FROM PLACES
  JOIN "favoritePlaces" ON PLACES.PLACE_ID = "favoritePlaces".PLACE_ID
  LEFT JOIN IMAGES ON IMAGES.PLACE_ID = PLACES.PLACE_ID
  LEFT JOIN users ON users.id = places.user_id
  WHERE "favoritePlaces".USER_ID = $1  ORDER BY "favoritePlaces".date DESC
  `,
    [Number(req.user_id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      let copyObj = data.rows;
      //Handle corrupted records
      for (const obj of copyObj) {
        if (obj.place_id === undefined || obj.place_id === null) {
          copyObj.place_id = Math.random();
        }
      }
      let final = groupBy(copyObj, "title");
      let finalArray = [];
      //Turn the newly created object of objects into an array of objects for front-end manipulation
      Object.keys(final).forEach(function (key) {
        finalArray.push(final[key]);
      });
      res
        .status(200)
        .send(finalArray.slice(0, Number(req.query.limit)).reverse());
    }
  );
});
server.get("/user/count/likedPlaces", authorizeToken, (req, res) => {
  pool.query(
    `SELECT COUNT(*) FROM "favoritePlaces" WHERE user_id=$1`,
    [Number(req.user_id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send(data.rows[0].count);
    }
  );
});
server.get("/user/count/savedPlaces", authorizeToken, (req, res) => {
  pool.query(
    `SELECT COUNT(*) FROM "savedPlaces" WHERE user_id=$1`,
    [Number(req.user_id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send(data.rows[0].count);
    }
  );
});
server.get("/userSavedPlaces", authorizeToken, (req, res) => {
  if (!Number(req.query.limit)) {
    res.status(400).send("Invalid LIMIT sent");
    return false;
  }
  pool.query(
    `SELECT PLACES.PLACE_ID, city,avatar,username,
	places.user_id,
	TITLE,
	DESCRIPTION,
	VISIBLE,
	SCORE,
	PLACELOCATION,
	CATEGORY,
	PRICE,
	ACCESSIBILITY,views,
	PLACES.DATE,
	DANGEROUS,
	URL,views,
	IMAGE_ID,
  CASE WHEN EXISTS (select * from "favoritePlaces" where "favoritePlaces".place_id = places.place_id AND user_id=$1)
THEN 'true' ELSE 'false' END AS liked,
CASE WHEN EXISTS (select * from "savedPlaces" where "savedPlaces".place_id = places.place_id AND user_id=$1) THEN 'true' 
ELSE 'false' END as saved,
	(SELECT COUNT(*) AS LIKEDNUMBER
		FROM "favoritePlaces"
		WHERE "favoritePlaces".PLACE_ID = PLACES.PLACE_ID ),
	(SELECT COUNT(USER_ID)
		FROM "savedPlaces"
		WHERE USER_ID = $1
		ORDER BY PLACES.PLACE_ID)
FROM PLACES
JOIN "savedPlaces" ON PLACES.PLACE_ID = "savedPlaces".PLACE_ID
LEFT JOIN IMAGES ON IMAGES.PLACE_ID = PLACES.PLACE_ID
LEFT JOIN users ON users.id = places.user_id
WHERE "savedPlaces".USER_ID = $1  ORDER BY "savedPlaces".date DESC`,
    [Number(req.user_id)],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      let copyObj = data.rows;
      //Handle corrupted records
      for (const obj of copyObj) {
        if (obj.place_id === undefined || obj.place_id === null) {
          copyObj.place_id = Math.random();
        }
      }
      let final = groupBy(copyObj, "title");
      let finalArray = [];
      //Turn the newly created object of objects into an array of objects for front-end manipulation
      Object.keys(final).forEach(function (key) {
        finalArray.push(final[key]);
      });
      res.status(200).send(finalArray.slice(0, req.query.limit).reverse());
    }
  );
});

server.post("/user/places", authorizeToken, async (req, res) => {
  if (Number(req.body.limit) < 0 || Number(req.body.limit) > 1000000) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  let b = (await adminTokenFunc(req.headers.jwt)) !== false;
  if (req.body.admin && !b) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  pool.query(
    `SELECT places.place_id,avatar,views,places.user_id,city,title,description,visible,score,placelocation,category,price,accessibility,places.date,dangerous,url,image_id,(SELECT COUNT(*) AS likednumber FROM "favoritePlaces" WHERE "favoritePlaces".place_id=places.place_id), CASE WHEN EXISTS (select * from "favoritePlaces" where "favoritePlaces".place_id = places.place_id AND user_id=$1 LIMIT  $2) THEN 'true' ELSE 'false' END AS liked, CASE WHEN EXISTS (select * from "savedPlaces" where "savedPlaces".place_id = places.place_id AND user_id=$1 LIMIT $2) THEN 'true' ELSE 
    'false' END as saved FROM (SELECT *,(SELECT COUNT(*) AS LIKEDNUMBER
    FROM "favoritePlaces"
    WHERE "favoritePlaces".PLACE_ID = PLACES.PLACE_ID)
    FROM PLACES ORDER BY likednumber DESC, places.date DESC LIMIT $2) places 
    LEFT JOIN images ON images.place_id = places.place_id 
    LEFT JOIN users ON places.user_id = users.id
    WHERE users.id::varchar=$1::varchar OR users.username::varchar=$1::varchar
    ORDER BY likednumber DESC`,
    [Number(req.body.admin) ? req.body.admin : req.user_id, req.body.limit],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        console.log(err);
        return false;
      }
      let copyObj = data.rows;
      //Handle corrupted records
      for (const obj of copyObj) {
        if (obj.place_id === undefined || obj.place_id === null) {
          copyObj.place_id = Math.random();
        }
      }
      //Turn the duplicate objects in the array into single object of objects grouped by the place_id
      const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      let final = groupBy(copyObj, "title");
      let finalArray = [];
      //Turn the newly created object of objects into an array of objects for front-end manipulation
      Object.keys(final).forEach(function (key) {
        finalArray.push(final[key]);
      });
      //Sort by Date
      res.status(200).send(finalArray.reverse());
    }
  );
});

server.post(
  "/user/avatar",
  authorizeToken,
  upload.single("images"),
  async (req, res) => {
    if (req.files) {
      res.status(500).send("We couldn't save the avatar");
      return false;
    }
    let previous = await pool.query(
      "SELECT avatar_public_id FROM users WHERE id=$1",
      [Number(req.user_id)]
    );
    if (previous.rows[0].avatar_public_id) {
      cloudinary.uploader.destroy(
        previous.rows[0].avatar_public_id,
        function (result) {
          console.log(result);
        }
      );
    }
    pool.query(
      "UPDATE users SET avatar = $1, avatar_public_id = $3 WHERE id=$2",
      [req.file.path, Number(req.user_id), req.file.filename],
      (err) => {
        if (err) {
          res.status(500).send("We couldn't save the avatar");
          return false;
        }
        res.status(200).send("Everything went successfully");
      }
    );
  }
);
// Login/Register.Account endpoints
server.delete("/admin/delete", adminToken, async (req, res) => {
  if (!req.headers.id) {
    res.status(401).send("Invalid data sent");
    return false;
  }
  const userPlaces = await pool.query(
    "SELECT place_id from places WHERE user_id=$1",
    [req.headers.id]
  );
  await pool.query(
    `DELETE FROM suggested_places WHERE suggested_user_id=$1 OR created_user_id=$1`,
    [Number(req.headers.id)]
  );

  await pool.query(`DELETE FROM "savedPlaces" WHERE user_id=$1`, [
    Number(req.headers.id),
  ]);

  await pool.query(`DELETE FROM "favoritePlaces" WHERE user_id=$1`, [
    Number(req.headers.id),
  ]);

  await pool.query("DELETE FROM notes WHERE user_id=$1", [
    Number(req.headers.id),
  ]);

  await pool.query("DELETE FROM replies_actions WHERE user_id=$1", [
    Number(req.headers.id),
  ]);

  await pool.query("DELETE FROM comments_replies WHERE user_id=$1", [
    Number(req.headers.id),
  ]);

  await pool.query("DELETE FROM comments_actions WHERE user_id=$1", [
    Number(req.headers.id),
  ]);

  await pool.query("DELETE FROM comments WHERE user_id=$1", [
    Number(req.headers.id),
  ]);

  await pool.query(
    "DELETE FROM verification_actions WHERE user_id=$1 AND type='user-delete'",
    [Number(req.headers.id)]
  );

  let counter = userPlaces.rows.length;
  userPlaces.rows.forEach(async (el) => {
    counter--;
    let images = await pool.query("SELECT url FROM images WHERE place_id=$1", [
      Number(el.place_id),
    ]);
    //Remove all the images related to the place if there are any
    if (images.rows.length) {
      images.rows.forEach((el) => {
        cloudinary.uploader.destroy(el.public_id, function (result) {
          console.log(result);
        });
      });
    }
    //Remove the images references on the database
    await pool.query("DELETE FROM images WHERE place_id=$1", [el.place_id]);
    //Get the comments associated with the place
    let comments_ids = await pool.query(
      "SELECT id FROM comments WHERE place_id=$1",
      [el.place_id]
    );

    //Delete these comments if there are any
    if (comments_ids.rows.length) {
      comments_ids.rows.forEach(async (el) => {
        //Delete the actions for the comments
        await pool.query("DELETE FROM replies_actions WHERE comment_id=$1", [
          el.id,
        ]);
        await pool.query("DELETE FROM comments_actions WHERE comment_id=$1", [
          el.id,
        ]);
        await pool.query("DELETE FROM comments_replies WHERE relating=$1", [
          el.id,
        ]);
      });
    }

    await pool.query("DELETE FROM comments WHERE place_id=$1", [el.place_id]);

    await pool.query(`DELETE FROM "savedPlaces" WHERE place_id=$1`, [
      el.place_id,
    ]);
    await pool.query(`DELETE FROM "favoritePlaces" WHERE place_id=$1 `, [
      el.place_id,
    ]);

    await pool.query("DELETE FROM places WHERE place_id=$1", [
      Number(el.place_id),
    ]);
    if (!counter) {
      await pool.query("DELETE FROM notes WHERE user_id=$1", [
        Number(req.headers.id),
      ]);

      await pool.query(`DELETE FROM "savedPlaces" WHERE user_id=$1`, [
        Number(req.headers.id),
      ]);

      await pool.query("DELETE FROM reported_items WHERE user_id=$1", [
        Number(req.headers.id),
      ]);

      await pool.query("DELETE FROM places WHERE user_id=$1", [
        Number(req.headers.id),
      ]);
      await pool.query(
        "DELETE FROM suggested_places WHERE suggested_user_id=$1",
        Number(req.headers.id)
      );
      console.log("16");

      await pool.query(
        "DELETE FROM suggested_places WHERE created_user_id=$1",
        Number(req.headers.id)
      );
      await pool.query("DELETE FROM verification_actions WHERE user_id=$1", [
        Number(req.headers.id),
      ]);
      await pool.query("DELETE FROM users WHERE id=$1", [Number(req.user_id)]);
    }
  });
  //Assuming no places
  if (!userPlaces.rows.length) {
    let comments_ids = await pool.query(
      "SELECT id FROM comments WHERE user_id=$1",
      [req.headers.id]
    );
    //Delete these comments if there are any
    if (comments_ids.rows.length) {
      comments_ids.rows.forEach(async (el) => {
        //Delete the actions for the comments
        await pool.query("DELETE FROM replies_actions WHERE comment_id=$1", [
          el.id,
        ]);
        await pool.query("DELETE FROM comments_actions WHERE comment_id=$1", [
          el.id,
        ]);
        await pool.query("DELETE FROM comments_replies WHERE relating=$1", [
          el.id,
        ]);
      });
    }
    await pool.query("DELETE FROM replies_actions WHERE user_id=$1", [
      req.headers.id,
    ]);
    await pool.query("DELETE FROM comments_actions WHERE user_id=$1", [
      req.headers.id,
    ]);
    await pool.query("DELETE FROM comments_replies WHERE user_id=$1", [
      req.headers.id,
    ]);
    await pool.query(`DELETE FROM "savedPlaces" WHERE  user_id=$1`, [
      req.headers.id,
    ]);
    await pool.query(`DELETE FROM "favoritePlaces" WHERE  user_id=$1`, [
      req.headers.id,
    ]);

    await pool.query("DELETE FROM reported_items WHERE user_id=$1", [
      req.headers.id,
    ]);
    await pool.query("DELETE FROM comments WHERE user_id=$1", [req.headers.id]);

    await pool.query("DELETE FROM verification_actions WHERE user_id=$1", [
      req.headers.id,
    ]);

    await pool.query(
      "DELETE FROM suggested_places WHERE suggested_user_id=$1 OR created_user_id=$1",
      [req.headers.id]
    );

    await pool.query("DELETE FROM places WHERE user_id=$1", [req.headers.id]);
    setTimeout(async () => {
      await pool.query("DELETE FROM users WHERE id = $1", [req.headers.id]);
    }, 0);
    res
      .status(200)
      .send(
        "User profile and all corresponsing data have been deleted successfully!"
      );
  }
});

server.get("/user/delete/:id", (req, res) => {
  if (req.params.id === undefined || req.params.id.length !== 200) {
    res.status(400).send("Грешен код");
    return false;
  }
  pool.query(
    "SELECT user_id FROM verification_actions WHERE url=$1",
    [req.params.id],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (!Number(data.rowCount) || !Number(data.rows[0].user_id)) {
        res.status(400).send("Грешен код");
        return false;
      }
      await pool.query(
        `DELETE FROM suggested_places WHERE suggested_user_id=$1 OR created_user_id=$1`,
        [Number(data.rows[0].user_id)]
      );
      await pool.query(`DELETE FROM "savedPlaces" WHERE user_id=$1`, [
        Number(data.rows[0].user_id),
      ]);
      await pool.query(`DELETE FROM "favoritePlaces" WHERE user_id=$1`, [
        Number(data.rows[0].user_id),
      ]);
      await pool.query("DELETE FROM notes WHERE user_id=$1", [
        Number(data.rows[0].user_id),
      ]);
      await pool.query("DELETE FROM replies_actions WHERE user_id=$1", [
        Number(data.rows[0].user_id),
      ]);
      await pool.query("DELETE FROM comments_replies WHERE user_id=$1", [
        Number(data.rows[0].user_id),
      ]);
      await pool.query("DELETE FROM comments_actions WHERE user_id=$1", [
        Number(data.rows[0].user_id),
      ]);
      await pool.query("DELETE FROM comments WHERE user_id=$1", [
        Number(data.rows[0].user_id),
      ]);

      await pool.query(
        "DELETE FROM verification_actions WHERE user_id=$1 AND type='user-delete'",
        [data.rows[0].user_id]
      );

      const userPlaces = await pool.query(
        "SELECT place_id from places WHERE user_id=$1",
        [data.rows[0].user_id]
      );
      let counter = userPlaces.rows.length;
      if (!userPlaces.rows.length) {
        await pool.query("DELETE FROM reported_items WHERE user_id=$1", [
          data.rows[0].user_id,
        ]);
        await pool.query("DELETE FROM users WHERE id = $1", [
          data.rows[0].user_id,
        ]);
        res
          .status(200)
          .send(
            "User profile and all corresponsing data have been deleted successfully!"
          );
        return false;
      }
      userPlaces.rows.forEach(async (el) => {
        counter--;
        let images = await pool.query(
          "SELECT url FROM images WHERE place_id=$1",
          [el.place_id]
        );
        //Remove all the images related to the place if there are any
        if (images.rows.length) {
          images.rows.forEach((el) => {
            cloudinary.uploader.destroy(el.public_id, function (result) {
              console.log(results);
            });
          });
        }
        //Remove the images references on the database
        await pool.query("DELETE FROM images WHERE place_id=$1", [el.place_id]);
        //Get the comments associated with the place
        let comments_ids = await pool.query(
          "SELECT id FROM comments WHERE place_id=$1",
          [el.place_id]
        );
        //Delete these comments if there are any
        if (comments_ids.rows.length) {
          comments_ids.rows.forEach(async (el) => {
            //Delete the actions for the comments
            await pool.query(
              "DELETE FROM replies_actions WHERE comment_id=$1",
              [el.id]
            );
            await pool.query(
              "DELETE FROM comments_actions WHERE comment_id=$1",
              [el.id]
            );
            await pool.query("DELETE FROM comments_replies WHERE relating=$1", [
              el.id,
            ]);
          });
        }
        await pool.query("DELETE FROM comments WHERE place_id=$1", [
          el.place_id,
        ]);
        await pool.query(`DELETE FROM "savedPlaces" WHERE place_id=$1`, [
          el.place_id,
        ]);
        await pool.query(`DELETE FROM "favoritePlaces" WHERE place_id=$1`, [
          el.place_id,
        ]);
        await pool.query("DELETE FROM places WHERE place_id=$1", [el.place_id]);
        if (!counter) {
          await pool.query("DELETE FROM notes WHERE user_id=$1", [
            Number(data.rows[0].user_id),
          ]);

          await pool.query("DELETE FROM reported_items WHERE user_id=$1", [
            Number(data.rows[0].user_id),
          ]);
          await pool.query("DELETE FROM places WHERE user_id=$1", [
            Number(data.rows[0].user_id),
          ]);
          await pool.query(
            "DELETE FROM verification_actions WHERE user_id=$1",
            [Number(data.rows[0].user_id)]
          );

          await pool.query(
            "DELETE FROM suggested_places WHERE suggested_user_id=$1",
            [Number(data.rows[0].user_id)]
          );

          await pool.query(
            "DELETE FROM suggested_places WHERE created_user_id=$1",
            [Number(data.rows[0].user_id)]
          );
          await pool.query("DELETE FROM comments_actions WHERE user_id=$1", [
            Number(data.rows[0].user_id),
          ]);
          await pool.query("DELETE FROM comments WHERE user_id=$1", [
            Number(data.rows[0].user_id),
          ]);
          await pool.query("DELETE FROM users WHERE id = $1", [
            Number(data.rows[0].user_id),
          ]);
          res
            .status(200)
            .send(
              "User profile and all corresponsing data have been deleted successfully!"
            );
        }
      });
    }
  );
});

server.delete("/user/delete", authorizeToken, (req, res) => {
  if (!req.body.password) {
    res.status(400);
    return false;
  }
  pool.query(
    "SELECT hash FROM users WHERE username=$1",
    [req.user],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      if (data.rowCount == 0) {
        res
          .status(409)
          .send("No record associated with the username for " + req.user);
        return false;
      }
      bcrypt.compare(
        req.body.password,
        data.rows[0].hash,
        async (err, result) => {
          if (err) {
            res.status(500).send("Internal server error");
            return false;
          }
          if (!result) {
            res.status(401).send("Wrong password");
            return false;
          }
          await pool.query(
            "DELETE FROM verification_actions WHERE user_id=$1 AND type='user-delete'",
            [Number(req.user_id)]
          );
          let token = genToken(100);
          pool.query(
            `INSERT INTO public.verification_actions(
            user_id, type, url, date)
            VALUES ($1, $2, $3, $4)`,
            [Number(req.user_id), "user-delete", token, new Date()],
            (err) => {
              if (err) {
                res.status(500).send("Internal server error");
                return false;
              }
              sendMail(
                `Изтриване на профил`,
                `Поискали сте изтриване на профила. Натиснете линка, за да потвърдите: https://unpopular-bulgaria.com/scrat/user/delete/${token} Променете си паролата ако не сте поисквали действието.`,
                req.email
              );
              res.status(200).send("Delete request submitted successfully");
            }
          );
        }
      );
    }
  );
});

server.post("/register", throttle({ rate: "2/s" }), async (req, res) => {
  if (
    !(
      req.body.username &&
      req.body.password &&
      req.body.email &&
      req.body.username.length <= 20 &&
      req.body.username.length >= 5 &&
      schema.validate(req.body.password) &&
      !/[а-яА-ЯЁё]/.test(req.body.username) &&
      !/[а-яА-ЯЁё]/.test(req.body.password) &&
      typeof req.body.username == "string" &&
      typeof req.body.password == "string" &&
      typeof req.body.email == "string"
    )
  ) {
    res.status(400).send("Missing or invalid data sent");
    return false;
  }
  let temp = await isMailTemp(req.body.email);
  if (temp) {
    res.status(406).send("Temporary emails are not allowed");
    return false;
  }

  let token = genToken(100);
  encrypt(req.body.password).then((hash) => {
    pool.query(
      "INSERT INTO users (username, email, date, hash, verified, emailsent, admin) VALUES ($1, $2, $3, $4, $5, $6, false)",
      [req.body.username, req.body.email, new Date(), hash, token, new Date()],
      async (err) => {
        if (err) {
          if (err.code == 23505) {
            res.status(409).send("The username already exists");
            return false;
          } else {
            res.status(500).send("Internal server error");
            return false;
          }
        } else {
          pool.query(
            "SELECT id,admin from users WHERE username=$1",
            [req.body.username],
            async (err, data) => {
              if (err) {
                res.status(500).send("Internal server error");
                return false;
              }
              let jwtToken = await generateToken(
                req.body.username,
                false,
                data.rows[0].id,
                req.body.email,
                Boolean(data.rows[0].admin) == true
              );
              let jwtToken2 = await generateToken(
                req.body.username,
                false,
                data.rows[0].id,
                req.body.email,
                Boolean(data.rows[0].admin) == true
              );
              sendEmail(
                "Потвърдете вашия акаунт",
                `Натиснете линка, за да потвърдите акаунта си: https://unpopular-bulgaria.com/scrat/verify/${token}`,
                req.body.email
              );
              res
                .status(200)
                .cookie("JWT", jwtToken2, {
                  expire: 1000 * 60 * 60 * 24 * 30 * 9,
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                })
                .send({ jwt: jwtToken });
              return false;
            }
          );
        }
      }
    );
  });
});
server.get("/verify/:id", (req, res) => {
  pool.query(
    "UPDATE users SET verified='true' WHERE verified=$1",
    [req.params.id],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");

        return false;
      }
      if (data.rowCount == 0) {
        res.status(401).send("Грешен код");
      } else {
        res.status(200).send("Акаунтът е потвърден");
      }
    }
  );
});
server.get("/verified", async (req, res) => {
  const userData = await authorizeTokenFunc(req.headers.jwt, req.cookies.JWT);
  if (!userData) {
    res.status(401).send("No jwt provided!");
    return false;
  }
  pool.query(
    "SELECT verified,email,admin from users where username=$1",
    [userData.Username],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      if (data.rowCount == 0) {
        res.status(401).send("There is no user with that username!");
        return false;
      }
      if (data.rows[0].verified == "true") {
        let jwtToken = await generateToken(
          userData.Username,
          true,
          userData.user_id,
          userData.email,
          Boolean(data.rows[0].admin)
        );
        let jwtToken2 = await generateToken(
          userData.Username,
          true,
          userData.user_id,
          userData.email,
          Boolean(data.rows[0].admin)
        );
        res
          .status(200)
          .cookie("JWT", jwtToken2, {
            expire: 1000 * 60 * 60 * 24 * 30 * 9,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .send({ jwt: jwtToken });
        return false;
      } else {
        res.status(403).send("Still unauthorized");
        return false;
      }
    }
  );
});
server.get("/newMail", async (req, res) => {
  let user = await authorizeTokenFunc(req.headers.jwt, req.cookies.JWT);
  pool.query(
    "SELECT email,emailsent,verified FROM users where id=$1",
    [Number(user.user_id)],
    (err, data) => {
      if (err) {
        //
        res.status(500).send("Internal server error");
        return false;
      }
      if (!data.rows) {
        res.status(400).send("Invalid jwt sent");
        return false;
      }
      if (data.rows[0].verified == true) {
        res.status(403).send("You are already authenticated!");
        return false;
      }
      let a = moment(new Date()); //now
      let b = moment(
        data.rows[data.rows.length - 1].emailsent.replace(/['"]+/g, "")
      ); // past email sent
      console.log(a.diff(b, "minutes"));
      if (a.diff(b, "minutes") >= 2 || a.diff(b, "minutes") == NaN) {
        sendEmail(
          "Потвърдете вашия акаунт",
          `Натиснете линка, за да потвърдите акаунта си https://unpopular-bulgaria.com/scrat/verify/` +
            data.rows[0].verified,
          data.rows[0].email
        );
        pool.query(
          "UPDATE users SET emailsent=$1 WHERE id=$2",
          [a, user.user_id],
          (err) => {
            if (err) {
              res.status(500).send("Internal server error");
              return false;
            }
            res.status(200).send("Email sent");
          }
        );
        return false;
      } else {
        res
          .status(429)
          .send("You should wait at least two minutes in between emails");
        return false;
      }
    }
  );
});
server.post("/login", throttle({ rate: "2/s" }), async (req, res) => {
  //Validating request
  if (
    !(
      req.body.username &&
      req.body.password &&
      typeof req.body.username == "string" &&
      typeof req.body.password == "string"
    )
  ) {
    res.status(400).send("Invalid request");
    return false;
  }
  //Checking if the user exists in the database
  pool.query(
    "SELECT hash FROM users WHERE username=$1 OR email=$1",
    [req.body.username],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      if (data.rowCount == 0) {
        res.status(409).send("No record associated with the email");
        return false;
      }
      //Yes, he does exist
      let unsuccessfulAttempts = await pool.query(
        `SELECT COUNT(*) FROM login_attempts WHERE "user"=$1`,
        [req.body.username]
      );
      let isLocked = await pool.query(
        `SELECT locked FROM users WHERE username=$1 OR email=$1`,
        [req.body.username]
      );
      //Is account already locked?
      if (isLocked.rows[0].locked) {
        //When was the verification email sent?
        let date = await pool.query(
          `SELECT verification_actions.date FROM verification_actions LEFT JOIN users on user_id=id WHERE username=$1 AND type='account-lock'`,
          [req.body.username]
        );

        let a = moment(new Date()); //now
        let b;
        if (date.rows.length) {
          b = moment(date.rows[0].date); // past email sent
        } else {
          b = moment.unix(0).format();
        }
        if (a.diff(b, "minutes") < 3) {
          res.status(425).send("Email has already been sent");
          return false;
        }
        let IPs = await pool.query(
          `SELECT ip FROM login_attempts WHERE "user"=$1`,
          [req.body.username]
        );
        let ip = IPs.rows.map((el) => el.ip);
        let url = await pool.query(
          `SELECT verification_actions.url FROM verification_actions LEFT JOIN users on user_id=id WHERE username=$1 AND type='account-lock'`,
          [req.body.username]
        );
        if (url.rows.length) {
          let email = await pool.query(
            "SELECT email FROM users WHERE username=$1",
            [req.body.username]
          );
          res.status(403).send("Profile locked");
          sendMail(
            `Профилът Ви беше заключен`,
            `Профилът Ви беше заключен поради над 5 неуспешни опита за влизане. Натиснете линка, за да го отключите: https://unpopular-bulgaria.com/scrat/user/unblock/${
              url.rows[data.rows.length - 1].url
            } IP адресите, от е имало опити за влизане са ${ip.filter(
              onlyUnique
            )}`,
            email.rows[0].email
          );
          return false;
        }
      }
      if (Number(unsuccessfulAttempts.rows[0].count) > 5) {
        //Account is locked
        res.status(403).send("Profile locked");
        await pool.query(
          `UPDATE public.users
        SET locked=$1
        WHERE username=$2`,
          [true, req.body.username]
        );
        let IPs = await pool.query(
          `SELECT ip FROM login_attempts WHERE "user"=$1`,
          [req.body.username]
        );
        let ip = IPs.rows.map((el) => el.ip);
        let email = await pool.query(
          "SELECT email FROM users WHERE username=$1 OR email=$1",
          [req.body.username]
        );
        let token = genToken(100);
        let user_id = await pool.query(
          "SELECT id from users WHERE username=$1 OR email=$1",
          [req.body.username]
        );
        pool.query(
          `INSERT INTO public.verification_actions(
          user_id, type, url, date)
          VALUES ($1, $2, $3, $4)`,
          [Number(user_id.rows[0].id), "account-lock", token, new Date()],
          (err) => {
            if (err) {
              res.status(500).send("Internal server error");
              return false;
            }
            sendMail(
              `Профилът Ви беше заключен`,
              `Профилът Ви беше заключен поради над 5 неуспешни опита за влизане. Натиснете линка, за да го отключите: https://unpopular-bulgaria.com/scrat/user/unblock/${token} IP адресите, от е имало опити за влизане са ${ip}`,
              email.rows[0].email
            );
          }
        );
        return false;
      }
      //Comparing the provided password
      bcrypt.compare(
        req.body.password,
        data.rows[0].hash,
        async function (err, result) {
          if (err) {
            res.status(500).send("Internal server error");
            return false;
          }
          //Passwords do not match
          if (!result) {
            let b = await pool.query(
              `INSERT INTO public.login_attempts(
              "user", ip, "time")
              VALUES ($1, $2, $3)`,
              [req.body.username, req.ip, new Date()]
            );
            console.log(b);
            res.status(401).send("Wrong password");
            return false;
          }
          let user_id = await pool.query(
            "SELECT id from users WHERE username=$1 OR email=$1",
            [req.body.username]
          );
          pool.query(
            "DELETE FROM verification_actions WHERE user_id=$1 AND type='account-lock'",
            [user_id.rows[0].id]
          );
          pool.query(
            "SELECT verified,id,email,admin,username FROM users where username=$1 OR email=$1 AND locked=false",
            [req.body.username],
            async (err, data) => {
              if (err) {
                return false;
              }
              if (!data.rows[0].verified.length) {
                res.status(401).send("Invalid data");
                return false;
              }
              if (data.rows[0].verified == "true") {
                let jwtToken = await generateToken(
                  data.rows[0].username,
                  true,
                  data.rows[0].id,
                  data.rows[0].email,
                  Boolean(data.rows[0].admin)
                );
                let jwtToken2 = await generateToken(
                  data.rows[0].username,
                  true,
                  data.rows[0].id,
                  data.rows[0].email,
                  Boolean(data.rows[0].admin)
                );
                res
                  .status(200)
                  .cookie("JWT", jwtToken2, {
                    expire: 1000 * 60 * 60 * 24 * 30 * 9,
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                  })
                  .send({ jwt: jwtToken });
              } else {
                let jwtToken = await generateToken(
                  req.body.username,
                  false,
                  data.rows[0].id,
                  data.rows[0].email
                );
                let jwtToken2 = await generateToken(
                  req.body.username,
                  true,
                  data.rows[0].id,
                  data.rows[0].email,
                  Boolean(data.rows[0].admin)
                );
                res
                  .status(200)
                  .cookie("JWT", jwtToken2, {
                    expire: 1000 * 60 * 60 * 24 * 30 * 9,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                  })
                  .send({ jwt: jwtToken });
              }
            }
          );
        }
      );
    }
  );
});

server.post("/note", authorizeToken, throttle({ rate: "2/s" }), (req, res) => {
  if (!req.body.place_id || req.body.value.lenght > 5000) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  pool.query(
    "SELECT FROM notes WHERE user_id=$1 AND place_id=$2",
    [req.user_id, req.body.place_id],
    async (err, data) => {
      if (err) {
        res.status(500);
        return false;
      }
      if (Number(data.rowCount)) {
        let action = await pool.query(
          `UPDATE public.notes
        SET note=$3
        WHERE user_id=$1 AND place_id=$2`,
          [req.user_id, req.body.place_id, req.body.value.substring(0, 5000)]
        );
      } else {
        pool.query(
          `INSERT INTO public.notes(
            user_id, place_id, note)
            VALUES ($1, $2, $3);`,
          [req.user_id, req.body.place_id, req.body.value.substring(0, 5000)]
        );
      }
      res.status(200).send("Data updates");
    }
  );
});

server.get("/notes", authorizeToken, throttle({ rate: "2/s" }), (req, res) => {
  pool.query(
    "SELECT places.place_id,title FROM notes LEFT JOIN places on places.place_id = notes.place_id WHERE notes.user_id=$1",
    [req.user_id],
    (err, data) => {
      if (err) {
        res.status(500);
        return false;
      }
      res.status(200).send(data.rows);
    }
  );
});

server.delete(
  "/note",
  authorizeToken,
  throttle({ rate: "2/s" }),
  (req, res) => {
    if (!Number(req.body.place_id)) {
      res.status(400).send("Invalid data");
      return false;
    }
    pool.query(
      "DELETE FROM notes WHERE place_id=$1 AND user_id=$2",
      [req.body.place_id, req.user_id],
      (err, data) => {
        if (err) {
          res.status(500);
          return false;
        }
        res.status(200).send("Note deleted");
      }
    );
  }
);

server.post(
  "/noteData",
  authorizeToken,
  throttle({ rate: "2/s" }),
  (req, res) => {
    if (!Number(req.body.place_id)) {
      res.status(400).send("Invalid data");
      return false;
    }
    pool.query(
      "SELECT note FROM notes WHERE user_id=$1 AND place_id=$2",
      [req.user_id, req.body.place_id],
      (err, data) => {
        if (err) {
          res.status(500).send("Internal server error");
          return false;
        }
        res.status(200).send(data.rows);
      }
    );
  }
);

server.get("/avatar", throttle({ rate: "2/s" }), authorizeToken, (req, res) => {
  pool.query(
    "SELECT avatar FROM users WHERE username=$1",
    [req.user],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (data.rows.length) {
        res.status(200).send(data.rows[0].avatar);
      } else {
        res.status(200).send();
      }
    }
  );
});
server.delete("/avatar/delete", authorizeToken, async (req, res) => {
  let data = await pool.query(
    "SELECT avatar_public_id FROM users WHERE username=$1",
    [req.user]
  );
  cloudinary.uploader.destroy(data.rows[0].avatar_public_id, function (result) {
    console.log(result);
  });
  pool.query(
    "UPDATE users SET avatar='', avatar_public_id='' WHERE username=$1",
    [req.user],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      res.status(200).send("Avatar deleted");
    }
  );
});
// Comments/Replies endpoints

server.post("/comment", authorizeToken, (req, res) => {
  if (
    !req.body.comment &&
    req.body.place_id &&
    typeof req.body.reason !== "string"
  ) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }

  pool.query(
    "INSERT INTO public.comments(place_id, user_id, content, date, visible, score) VALUES ($1,$2,$3,$4,$5,$6)",
    [
      Number(req.body.place_id),
      Number(req.user_id),
      req.body.comment.substring(0, 500),
      new Date(),
      true,
      0,
    ],
    (err, data) => {
      if (err) {
        if (Number(err.code) == 23505) {
          res.status(409).send("Alredy exists");
        } else {
          res.status(500).send("Internal server error");
        }
        return false;
      }
      res.status(200).send("Comment added successfully!");
    }
  );
});
server.post("/reply", authorizeToken, (req, res) => {
  if (!(req.body.comment && req.body.relating)) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }

  pool.query(
    "INSERT INTO public.comments_replies(relating, content, user_id, date, visible, score) VALUES ($1,$2,$3,$4,$5,$6)",
    [
      Number(req.body.relating),
      req.body.comment.substring(0, 500),
      Number(req.user_id),
      new Date(),
      true,
      0,
    ],
    (err, data) => {
      if (err) {
        if (err.code == 23505) {
          res.status(409).send("Alredy exists");
        } else {
          res.status(500).send("Internal server error");
        }

        return false;
      }
      res.status(200).send("Reply added successfully!");
    }
  );
});
server.get("/comments", async (req, res) => {
  if (!req.query.place_id) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }
  let userFormat = "%s",
    user_id1,
    user_id2;
  if (req.headers.jwt && authorizeTokenFunc(req.headers.jwt, req.cookies.JWT)) {
    user_id = await authorizeTokenFunc(req.headers.jwt, req.cookies.JWT);
    user_id1 = user_id.user_id;
    user_id2 = user_id.user_id;
  } else {
    user_id1 = "replies_actions.user_id";
    user_id2 = "comments_actions.user_id";
  }
  let sql = format(
    `SELECT PLACE_ID,
	"comments".USER_ID, avatar,
	users.username,
	"comments".score AS "comment_score",
	"comments"."content" AS "comment_content",
	COMMENTS_REPLIES."content" AS "reply_content",
	"comments".DATE AS "comment_date",
	"comments"."id" AS "comments_id",
	comments_replies."id" AS "replies_id",
	comments_replies.SCORE AS "reply_score",
	COMMENTS_REPLIES."date" AS "reply_date",
	(SELECT count(*) from comments where place_id=$1) AS "comments_count",
	(SELECT count(*) from comments_replies where relating="comments"."id") AS "replies_count",
	replies_actions.action AS "replies_actions",
	comments_actions.action AS "comments_actions"
FROM "comments"
LEFT JOIN COMMENTS_REPLIES ON COMMENTS_REPLIES.RELATING = "comments".ID
LEFT JOIN users ON users.id = "comments".user_id
LEFT JOIN replies_actions on replies_actions.user_id=${userFormat} AND replies_actions."reply_id"=comments_replies."id"
LEFT JOIN comments_actions on comments_actions.user_id=${userFormat} AND comments_actions.comment_id="comments"."id"
WHERE "comments".place_id = $1 AND ("comments".visible=true OR comments_replies.visible=true) ORDER BY "comments".score `,
    user_id1,
    user_id2
  );
  pool.query(sql, [req.query.place_id], (err, data) => {
    if (err) {
      res.status(500).send("Internal server error");
      return false;
    }
    let copyObj = data.rows;
    //Handle corrupted records
    for (const obj of copyObj) {
      if (obj.place_id === undefined || obj.place_id === null) {
        copyObj.place_id = Math.random();
      }
    }
    let final = groupBy(copyObj, "comments_id");
    let finalArray = [];
    //Turn the newly created object of objects into an array of objects for front-end manipulation
    Object.keys(final).forEach(function (key) {
      finalArray.push(final[key]);
    });
    res.status(200).send(finalArray);
  });
});
server.post("/score/reply", authorizeToken, (req, res) => {
  if (
    !(
      Number(Number(req.body.type)) &&
      req.body.reply_id &&
      Number(req.body.comment_id)
    )
  ) {
    res.status(400).send("Not enough data was provided");
    return false;
  }

  pool.query(
    "SELECT COUNT(*) FROM replies_actions WHERE comment_id=$1 AND user_id=$2 AND action=$3 AND reply_id=$4",
    [
      Number(req.body.comment_id),
      Number(req.user_id),
      Number(req.body.type),
      req.body.reply_id,
    ],
    async (err, data) => {
      if (err) {
        res.status(500);
        return false;
      }
      //Check if the same action has already been performed
      if (Number(data.rows[0].count)) {
        if (Number(req.body.type) == 1) {
          await pool.query(
            `UPDATE public.comments_replies
	SET score=score+1
	WHERE id=$1`,
            [req.body.reply_id]
          );
        } else {
          await pool.query(
            `UPDATE public.comments_replies
	SET score=score-1
	WHERE id=$1`,
            [req.body.reply_id]
          );
        }
        await pool.query(
          "DELETE FROM replies_actions WHERE user_id=$1 AND reply_id=$2",
          [Number(req.user_id), req.body.reply_id]
        );
      } else {
        let sql = format(
          `UPDATE public.comments_replies	SET score=score %s 1	WHERE id=$1`,
          Number(req.body.type) == 1 ? "-" : "+"
        );
        await pool.query(sql, [req.body.reply_id]);
        pool.query(
          "SELECT COUNT(*) FROM replies_actions WHERE user_id=$1 AND reply_id=$2",
          [Number(req.user_id), req.body.reply_id],
          async (err, data) => {
            if (err) {
              res.status(500).send("Internal server error");
              return false;
            }

            if (!Number(data.rows[0].count)) {
              await pool.query(
                "INSERT INTO replies_actions(user_id,reply_id,action,comment_id,date) VALUES($1,$2,$3,$4,$5)",
                [
                  Number(req.user_id),
                  req.body.reply_id,
                  Number(req.body.type),
                  Number(req.body.comment_id),
                  new Date(),
                ]
              );
            } else {
              await pool.query(
                "DELETE FROM replies_actions WHERE user_id=$1 AND reply_id=$2",
                [Number(req.user_id), req.body.reply_id]
              );
            }
          }
        );
      }
      res.status(200).send("Everything was successfull");
    }
  );
  //Check if opposite statement exists and if true, erase it and update the value
});
server.post("/score/comment", authorizeToken, (req, res) => {
  if (!(Number(Number(req.body.type)) && Number(req.body.comment_id))) {
    res.status(400).send("Not enough data was provided");
    return false;
  }
  pool.query(
    "SELECT COUNT(*) FROM comments_actions WHERE comment_id=$1 AND user_id=$2 AND action=$3",
    [
      Number(Number(req.body.comment_id)),
      Number(Number(req.user_id)),
      Number(Number(req.body.type)),
    ],
    async (err, data) => {
      if (err) {
        res.status(500);
        return false;
      }
      //Check if the same action has already been performed
      if (Number(data.rows[0].count)) {
        if (Number(req.body.type) == 1) {
          await pool.query(
            `UPDATE public.comments
	SET score=score+1
	WHERE id=$1`,
            [Number(Number(req.body.comment_id))]
          );
        } else {
          await pool.query(
            `UPDATE public.comments
	SET score=score-1
	WHERE id=$1`,
            [Number(Number(req.body.comment_id))]
          );
        }
        await pool.query(
          "DELETE FROM comments_actions WHERE user_id=$1 AND comment_id=$2",
          [Number(req.user_id), Number(req.body.comment_id)]
        );
      } else {
        let sql = format(
          `UPDATE public.comments	SET score=score %s 1	WHERE id=$1`,
          Number(req.body.type) == 1 ? "-" : "+"
        );
        await pool.query(sql, [Number(req.body.comment_id)]);
        pool.query(
          "SELECT COUNT(*) FROM comments_actions WHERE user_id=$1 AND comment_id=$2",
          [Number(req.user_id), Number(req.body.comment_id)],
          async (err, data) => {
            if (err) {
              res.status(500).send("Internal server error");
              return false;
            }
            if (!Number(data.rows[0].count)) {
              await pool.query(
                "INSERT INTO comments_actions(user_id,comment_id,action,date) VALUES($1,$2,$3,$4)",
                [
                  Number(req.user_id),
                  Number(req.body.comment_id),
                  Number(req.body.type),
                  new Date(),
                ]
              );
            } else {
              await pool.query(
                "DELETE FROM comments_actions WHERE user_id=$1 AND comment_id=$2",
                [Number(req.user_id), Number(req.body.comment_id)]
              );
            }
          }
        );
      }
      res.status(200).send("Everything was successfull");
    }
  );
  //Check if opposite statement exists and if true, erase it and update the value
});
server.delete("/comment/delete", authorizeToken, async (req, res) => {
  if (!Number(req.body.comment_id)) {
    res.status(400).send("Incomplete data");
    return false;
  }
  let b = await !adminTokenFunc(req.headers.jwt);
  let specialUser = !b ? "" : " AND user_id=$2";
  let params = !b
    ? [Number(Number(req.body.comment_id))]
    : [Number(Number(req.body.comment_id)), Number(Number(req.user_id))];
  let sql = "SELECT COUNT(*) FROM comments WHERE id=$1" + specialUser;
  pool.query(sql, params, async (err, data) => {
    if (err) {
      res.status(500).send("Internal server error");
      return false;
    }
    if (Number(data.rows[0].count) !== 0) {
      await pool.query("DELETE FROM replies_actions WHERE comment_id=$1", [
        Number(req.body.comment_id),
      ]);
      await pool.query("DELETE FROM comments_actions WHERE comment_id=$1", [
        Number(req.body.comment_id),
      ]);
      await pool.query("DELETE FROM comments_replies WHERE relating=$1", [
        Number(req.body.comment_id),
      ]);
      let final = await pool.query(
        "DELETE FROM comments WHERE id = $1" + specialUser,
        params
      );
      res
        .status(final.rowCount == 1 ? 200 : 403)
        .send(`${final.rowCount} rows deleted`);
    } else {
      res.status(403).send("You are unauthorized to delete this comment");
    }
  });
});
server.delete("/reply/delete", authorizeToken, async (req, res) => {
  if (Number(req.body.comment_id)) {
    req.body.reply_id = Number(req.body.comment_id);
  }
  if (!req.body.reply_id) {
    res.status(400).send("Incomplete data");
    return false;
  }
  let b = await !adminTokenFunc(req.headers.jwt);
  let specialUser = !b ? "" : " AND user_id=$2";
  let params = !b
    ? [Number(req.body.reply_id)]
    : [Number(req.body.reply_id), Number(Number(req.user_id))];
  let sql = "SELECT COUNT(*) FROM comments_replies WHERE id=$1" + specialUser;
  pool.query(sql, params, async (err, data) => {
    if (err) {
      res.status(500).send("Internal server error");
      return false;
    }
    if (data.rows[0].count) {
      await pool.query("DELETE FROM replies_actions WHERE reply_id=$1", [
        req.body.reply_id,
      ]);
      let final = await pool.query(
        "DELETE FROM comments_replies WHERE id = $1" + specialUser,
        params
      );
      res
        .status(final.rowCount ? 200 : 403)
        .send(`${final.rowCount} rows deleted`);
    } else {
      res
        .status(403)
        .send(
          "Either you are not authorized to delete the reply or no rows associated with you and the id are found"
        );
    }
  });
});

//Change user data endpoints
server.put("/user/password/forgotten", (req, res) => {
  if (req.body.cred.length > 100 || req.body.cred.length == 0) {
    res.status(400).send("Data sent invalid!");
    return false;
  }
  pool.query(
    "SELECT email from users WHERE email=$1 OR username=$1",
    [req.body.cred],
    async (err, data) => {
      if (!data.rows.length) {
        res.status(200).send("All actions done");
        return false;
      }
      let date = await pool.query(
        "SELECT verification_actions.date FROM verification_actions JOIN users on user_id=id WHERE type='password-reset' AND username=$1 OR email = $1",
        [req.body.cred]
      );
      let a = moment(new Date()); //now
      let b = moment(date.rows.length && date.rows[date.rows.length - 1].date); // past email sent
      if (a.diff(b, "minutes") >= 10 || !date.rows.length) {
        let user_id = await pool.query(
          "SELECT id,email from users WHERE email=$1 OR username=$1",
          [req.body.cred]
        );
        let token = await genToken(100);
        await pool.query(
          `DELETE FROM public.verification_actions
        WHERE user_id=$1 AND type=$2`,
          [user_id.rows[0].id, "password-reset"]
        );
        await pool.query(
          `INSERT INTO public.verification_actions(
          user_id, type, url, date)
          VALUES ($1, 'password-reset', $2, $3)`,
          [user_id.rows[0].id, token, new Date()]
        );
        sendMail(
          `Възстановяване на паролата`,
          `Поискали сте възстановяване на паролата. Натиснете следния линк: https://unpopular-bulgaria.com/reset/${token}`,
          data.rows[0].email
        );
      }
      res.status(200).send("All actions done");
    }
  );
});
server.put("/user/password/code", (req, res) => {
  if (!req.body.code || req.body.code.length !== 200) {
    res.status(401).send("Code is invalid");
    return false;
  }
  pool.query(
    "SELECT COUNT(*) FROM verification_actions WHERE url=$1",
    [req.body.code],
    (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (Number(data.rows[0].count) !== 0) {
        res.status(200).send("Code is valid");
      } else {
        res.status(401).send("Code is invalid");
      }
    }
  );
});
server.put("/user/password/reset", (req, res) => {
  if (
    !req.body.password &&
    req.body.password.length < 8 &&
    req.body.password.length > 100 &&
    !schema.validate(req.body.password) &&
    typeof req.body.password !== "string"
  ) {
    res.status(401).send("Password invalid");
    return false;
  }
  pool.query(
    "SELECT (SELECT COUNT(*) FROM verification_actions WHERE url=$1), user_id FROM verification_actions WHERE url=$1",
    [req.body.code],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (!data.rows.length) {
        return false;
      }
      await pool.query("DELETE FROM verification_actions WHERE url=$1", [
        req.body.code,
      ]);
      encrypt(req.body.password).then(async (hash) => {
        await pool.query(
          `UPDATE public.users
        SET hash=$1
        WHERE id=$2`,
          [hash, data.rows[0].user_id]
        );
        res.status(200).send("Password changed");
      });
    }
  );
});
server.get("/user/unblock/:id", async (req, res) => {
  if (!req.params.id || req.params.id.length !== 200) {
    res.status(400).send("Грешен код");
    return false;
  }
  let data = await pool.query(
    "SELECT user_id,username,email FROM verification_actions JOIN users on user_id=id WHERE url=$1",
    [req.params.id]
  );
  if (Number(data.rowCount) > 0) {
    pool.query("DELETE FROM verification_actions WHERE user_id=$1 AND url=$2", [
      data.rows[0].user_id,
      req.params.id,
    ]);
    pool.query("UPDATE users SET locked=false WHERE id=$1", [
      data.rows[0].user_id,
    ]);
    pool.query(`DELETE FROM login_attempts WHERE "user"=$1`, [
      data.rows[0].username,
    ]);
    sendMail(
      `Отключване на профила`,
      `Профилът Ви беше успешно отключен. Можете да влезете в него.`,
      data.rows[0].email
    );
    res.status(200).send("Профилът е отключен");
  } else {
    res.status(200).send("Грешен код");
  }
});
server.put("/user/password", authorizeToken, async (req, res) => {
  if (
    !req.body.password ||
    req.body.newPassword.length < 8 ||
    !req.body.newPassword ||
    !schema.validate(req.body.newPassword) ||
    typeof req.body.password !== "string" ||
    typeof req.body.newPassword !== "string"
  ) {
    res.status(400).send("Not enough data was provided");
    return false;
  }
  let previous = await Verification_Email(Number(req.user_id));
  if (!previous) {
    res.status(405).send("Too many email requests");
    return false;
  }
  pool.query(
    "SELECT hash FROM users WHERE username=$1",
    [req.user],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      if (data.rowCount == 0) {
        res.status(409).send("No record associated with the username");
        return false;
      }
      bcrypt.compare(
        req.body.password,
        data.rows[0].hash,
        async (err, result) => {
          if (err) {
            res.status(500).send("Internal server error");
            return false;
          }
          if (!result) {
            res.status(401).send("Wrong password");
            return false;
          }
          let token = genToken(100);
          await pool.query(
            "DELETE FROM verification_actions WHERE user_id=$1 AND type='password'",
            [Number(req.user_id)]
          );
          try {
            encrypt(req.body.newPassword).then((hash) => {
              pool.query(
                `INSERT INTO public.verification_actions(
	user_id, type, url, payload, date)
	VALUES ($1, $2, $3, $4, $5)`,
                [Number(req.user_id), "password", token, hash, new Date()]
              );
              sendMail(
                `Промяна на паролата`,
                `Поискали сте промяна на паролата. Натиснете линка, за да потвърдите: https://unpopular-bulgaria.com/scrat/user/password/${token} Променете си паролата ако не сте поисквали промяна.`,
                req.email
              );
              res.status(200).send("Done");
            });
          } catch (err) {
            res.status(500).send("Internal server error");
          }
        }
      );
    }
  );
});

server.get("/user/password/:id", (req, res) => {
  if (!req.params.id || req.params.id.length !== 200) {
    res.status(400).send("Неверен код");
    return false;
  }
  pool.query(
    "SELECT payload,user_id FROM verification_actions JOIN users on user_id=id WHERE url=$1",
    [req.params.id],
    async (err, data) => {
      if (err) {
        res.status(500).send();
      }
      if (Number(data.rowCount) > 0) {
        await pool.query(
          `UPDATE public.users
SET hash=$1
WHERE id=$2`,
          [data.rows[0].payload, data.rows[0].user_id]
        );

        res
          .status(200)
          .send(
            "Паролата е променена. Влезнете отново в профила си, за да видите промяната"
          );
        pool.query(
          "DELETE FROM verification_actions WHERE user_id=$1 AND type='password'",
          [data.rows[0].user_id]
        );
      } else {
        res.status(200).send("Грешен код");
      }
    }
  );
});

server.put("/user/email", authorizeToken, async (req, res) => {
  if (
    req.body.password == undefined ||
    req.body.email == undefined ||
    req.body.email.length > 50 ||
    req.body.email.length < 5 ||
    typeof req.body.email !== "string" ||
    typeof req.body.password !== "string"
  ) {
    res.status(400).send("Not enough data was provided.");
    return false;
  }
  let previous = await Verification_Email(Number(req.user_id));
  if (!previous) {
    res.status(405).send("Too many email requests");
    return false;
  }
  let temp = await isMailTemp(req.body.email);
  if (temp) {
    res.status(406).send("Temporary emails are not allowed");
    return false;
  }
  pool.query(
    "SELECT hash FROM users WHERE username=$1",
    [req.user],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error!");
        return false;
      }
      let duplicated = await pool.query(
        "SELECT COUNT(*) FROM users WHERE email=$1",
        [req.body.email]
      );
      if (Number(duplicated.rows[0].count)) {
        res.status(409).send("Email is already in the database");
        return false;
      }
      if (data.rowCount == 0) {
        res.status(400).send("No record associated with the email");
        return false;
      }
      bcrypt.compare(
        req.body.password,
        data.rows[0].hash,
        async (err, result) => {
          if (err) {
            res.status(500).send("Internal server error");
            return false;
          }
          if (!result) {
            res.status(401).send("Wrong password");
            return false;
          }
          let token = genToken(100);
          await pool.query(
            "DELETE FROM verification_actions WHERE user_id=$1 AND type='email'",
            [Number(req.user_id)]
          );
          try {
            await pool.query(
              `UPDATE public.users
  SET email=$1
  WHERE id=$2`,
              [req.body.email, Number(req.user_id)]
            );
            let admin = await pool.query(
              "SELECT admin from users WHERE id=$1",
              [req.user_id]
            );

            let jwtToken = await generateToken(
              req.user,
              true,
              req.user_id,
              req.body.email,
              Boolean(admin.rows[0].admin) == true
            );
            let jwtToken2 = await generateToken(
              req.user,
              true,
              req.user_id,
              req.body.email,
              Boolean(admin.rows[0].admin) == true
            );
            res
              .status(200)
              .cookie("JWT", jwtToken2, {
                expire: 1000 * 60 * 60 * 24 * 30 * 9,
                httpOnly: true,
                secure: true,
                sameSite: "none",
              })
              .send({ jwt: jwtToken });
          } catch (err) {
            res.status(500).send("Internal server error");
          }
        }
      );
    }
  );
});

server.put("/user/name", authorizeToken, async (req, res) => {
  if (
    req.body.name.length > 20 ||
    req.body.name.length < 5 ||
    req.body.name == undefined ||
    req.body.name == req.user ||
    typeof req.body.name !== "string"
  ) {
    res
      .status(400)
      .send(
        "New name should be provided and it must have over 5 and under 20 characters"
      );
    return false;
  }
  let previous = await Verification_Email(Number(req.user_id));
  if (!previous) {
    res.status(405).send("Too many email requests");
    return false;
  }
  let token = genToken(100);
  let count = await pool.query("SELECT count(*) FROM users WHERE username=$1", [
    req.body.name,
  ]);
  if (Number(count.rows[0].count) > 0) {
    res.status(409).send("Username is already in use");
    return false;
  }
  await pool.query(
    "DELETE FROM verification_actions WHERE user_id=$1 AND type='name'",
    [Number(req.user_id)]
  );
  pool.query(
    `INSERT INTO public.verification_actions(
     user_id, type, url, payload, date)
    VALUES ($1,$2,$3,$4,$5)`,
    [Number(req.user_id), "name", token, req.body.name, new Date()],
    (err) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return false;
      }
      sendMail(
        `Промяна на името`,
        `Поискали сте промяна на името. Натиснете линка, за да потвърдите: https://unpopular-bulgaria.com/scrat/user/name/${token} Променете си паролата ако не сте поисквали промяна.`,
        req.email
      );
      res.status(200).send("Check your email");
    }
  );
});

server.get("/user/name/:id", (req, res) => {
  if (!req.params.id || req.params.id.length !== 200) {
    res.status(400).send("Неверен код");
    return false;
  }
  pool.query(
    "SELECT payload,user_id,username,email,admin FROM verification_actions JOIN users on user_id=id WHERE url=$1",
    [req.params.id],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return false;
      }
      if (Number(data.rowCount) > 0) {
        await pool.query(
          `UPDATE public.users
SET username=$1
WHERE id=$2`,
          [data.rows[0].payload, data.rows[0].user_id]
        );
        let jwtToken = await generateToken(
          data.rows[0].payload,
          true,
          data.rows[0].user_id,
          data.rows[0].email,
          Boolean(data.rows[0].admin) == true
        );
        let jwtToken2 = await generateToken(
          data.rows[0].payload,
          true,
          data.rows[0].user_id,
          data.rows[0].email,
          Boolean(data.rows[0].admin) == true
        );
        res
          .status(200)
          .cookie("JWT", jwtToken2, {
            expire: 1000 * 60 * 60 * 24 * 30 * 9,
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .send({ jwt: jwtToken });
        pool.query(
          "DELETE FROM verification_actions WHERE user_id=$1 AND type='name'",
          [data.rows[0].user_id]
        );
      } else {
        res.status(200).send("Неверен код");
      }
    }
  );
});

server.get("/user/profile/", throttle({ rate: "5/s" }), (req, res) => {
  if (req.query.username.length < 5 || req.query.username.length > 100) {
    res.status(400).send("Invalid username");
    return false;
  }
  pool.query(
    `SELECT places.place_id,admin,views,title,description,visible,score,placelocation,category,price,accessibility,places.date,city,dangerous,user_id,images.url,username,(SELECT avatar FROM users WHERE username=$1) FROM places  JOIN users on users.id=places.user_id 
    LEFT JOIN images on images.place_id = places.place_id WHERE username=$1  LIMIT 100
    `,
    [req.query.username],
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return false;
      }
      let copyObj = data.rows;
      //Handle corrupted records
      for (const obj of copyObj) {
        if (obj.place_id === undefined || obj.place_id === null) {
          copyObj.place_id = Math.random();
        }
      }
      let final = groupBy(copyObj, "title");
      let finalArray = [];
      //Turn the newly created object of objects into an array of objects for front-end manipulation
      Object.keys(final).forEach(function (key) {
        finalArray.push(final[key]);
      });
      res.status(200).send(finalArray);
    }
  );
});
server.get(
  "/user/profile/additional",
  throttle({ rate: "5/s" }),
  (req, res) => {
    if (req.query.username.length < 5 || req.query.username.length > 100) {
      res.status(400).send("Invalid username");
      return false;
    }
    pool.query(
      "SELECT avatar,username,date,admin FROM users WHERE username=$1",
      [req.query.username],
      (err, data) => {
        if (err) {
          res.status(500).send("Internal server error");
          return false;
        }
        res.status(200).send(data.rows);
      }
    );
  }
);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Server is up");
});

const Verification_Email = async (user_id) => {
  let data = await pool.query(
    "SELECT date from verification_actions WHERE user_id=$1 ORDER BY date DESC LIMIT 1",
    [Number(user_id)]
  );
  if (!data.rows.length) {
    return true;
  }
  let a = moment(new Date()); //now
  let b = moment(data.rows[0].date); // past email sent
  if (a.diff(b, "minutes") >= 3) {
    return true;
  } else {
    return false;
  }
};
const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};
server.get("*", function (req, res) {
  res.setHeader("Content-type", "text/html");
  res.status(404).send("Може би си загубил пътя?");
});
