const express = require("express");
const {
  authorizeToken,
  generateToken,
  authorizeTokenFunc,
  getWeatherKey,
  isMailTemp,
} = require("./src/auth");
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
const axios = require("axios");
const sanitizer = require("express-html-sanitizer");
const fs = require("fs");
const archive = require("simple-archiver").archive;
const sendMail = require("./src/email");
config = {
  allowedTags: ["b", "i", "em", "strong", "a"],
  allowedAttributes: { a: ["href"] },
  allowedIframeHostnames: ["www.youtube.com"],
};
const sanitizeReqBody = sanitizer(config);
server.use(sanitizeReqBody);

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(32, function (err, raw) {
      if (err) return cb(err);

      cb(null, raw.toString("hex") + "." + mime.extension(file.mimetype));
    });
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    let ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: { fileSize: 3000000 },
});

server.use(cors());
server.use(cookieParser("MySecret"));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json({ limit: "10kb" }));

//Grouping function to be used by endpoints sending places. It groups similar objects based on a provided identical key
const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

server.post("/report", authorizeToken, (req, res) => {
  if (
    !(
      Number(req.body.item_id) &&
      req.body.type &&
      req.body.reason !== undefined
    )
  ) {
    res.status(400).send("Incomplete data provided");
    return false;
  }
  pool.query(
    `INSERT INTO public.reported_items(item_id, type, reason, date, user_id)
	VALUES ($1, $2, $3,$4,$5)`,
    [
      Number(req.body.item_id),
      req.body.type,
      req.body.reason.substring(0, 500),
      new Date(),
      req.user_id,
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
      req.user_id,
      Number(req.body.place_id),
      new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
    ],
    (err, data) => {
      if (err) {
        console.log(err);
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
  let user_id = await authorizeTokenFunc(req.headers.jwt);
  user_id = user_id.user_id;
  pool.query(
    `DELETE FROM "savedPlaces" WHERE user_id=$1 AND place_id=$2`,
    [user_id, req.body.place_id],
    (err, data) => {
      if (err) {
        console.log(err);
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
      //   console.log(err);
      res.status(500).send("Could not connect to the API!");
    });
});

server.post("/like", authorizeToken, (req, res) => {
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
    [req.user_id, req.body.place_id],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return false;
      }
      if (Number(data.rows[0].count) == 0) {
        pool.query(
          `INSERT INTO public."favoritePlaces"(user_id, place_id, date) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [
            req.user_id,
            Number(req.body.place_id),
            new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
              .toISOString()
              .replace("T", " ")
              .replace("Z", ""),
          ],
          (err, data) => {
            if (err) {
              console.log(err);
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

server.post("/unlike", authorizeToken, async (req, res) => {
  if (!req.body.place_id) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }
  if (!req.verified) {
    res.status(403).send("Your account is unauthorized! Verify your account!");
    return false;
  }
  let user_id = await authorizeTokenFunc(req.headers.jwt);
  user_id = user_id.user_id;
  pool.query(
    `DELETE FROM "favoritePlaces" WHERE user_id=$1 AND place_id=$2`,
    [user_id, req.body.place_id],
    (err, data) => {
      if (err) {
        console.log(err);
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
});

server.post("/search", async (req, res) => {
  if (req.body.limit == undefined || req.body.offset == undefined) {
    res.status(400).send("Not enough data was provided.");
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
    category = req.body.category;
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

  if (req.headers.jwt && authorizeTokenFunc(req.headers.jwt)) {
    user_id = await authorizeTokenFunc(req.headers.jwt);
    user_id = user_id.user_id;
  } else {
    user_id = -1;
    userFormat = "%s";
  }
  let sql = format(
    `SELECT places.place_id,user_id,username,avatar,city,title,description,visible,score,placelocation,category,price,accessibility,places.date,dangerous,url,image_id,(SELECT COUNT(*) AS likednumber FROM "favoritePlaces" WHERE "favoritePlaces".place_id=places.place_id), CASE WHEN EXISTS (select * from "favoritePlaces" where "favoritePlaces".place_id = places.place_id AND user_id=` +
      userFormat +
      ` LIMIT  %s) THEN 'true' ELSE 'false' END AS liked, CASE WHEN EXISTS (select * from "savedPlaces" where "savedPlaces".place_id = places.place_id AND user_id=` +
      userFormat +
      ` LIMIT %s ) THEN 'true' ELSE 'false' END as saved FROM (SELECT *,(SELECT COUNT(*) AS LIKEDNUMBER
FROM "favoritePlaces"
WHERE "favoritePlaces".PLACE_ID = PLACES.PLACE_ID)
FROM PLACES ORDER BY likednumber DESC, places.date DESC LIMIT %s OFFSET %s) places
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
      " ORDER BY likednumber DESC",
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
      console.log(sql, err);
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
    let final = groupBy(copyObj, "place_id");
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
    category = req.body.category;
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
    "SELECT COUNT(place_id) FROM places WHERE user_id=$1",
    [req.user_id],
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

server.post("/place", authorizeToken, upload.array("images", 3), (req, res) => {
  let imagesSrc = req.files.map((file) => file.filename);
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
  pool.query(
    "INSERT INTO places (user_id, title, description, visible, score, placelocation, category, price, accessibility, date, dangerous,city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
    [
      req.user_id,
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
    ],
    (err) => {
      if (err) {
        if (err.code == 23505) {
          res.status(409).send("Place already exists");
          return false;
        }
        console.log(err);
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
              "INSERT INTO images (place_id,url,date) VALUES ($1,$2,$3)",
              [data.rows[0].place_id, el, new Date()],
              (err) => {
                if (err) {
                  return false;
                }
              }
            );
          });
        }
      );
    }
  );
});

server.put(
  "/place",
  authorizeToken,
  upload.array("images", 3),
  async (req, res) => {
    let imagesSrc = req.files.map((file) => file.filename);
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
      [req.user_id, req.body.place_id]
    );
    if (!Number(owns.rows[0].count)) {
      res.status(403).send("You do not own this place!");
      return false;
    }
    pool.query(
      "UPDATE places SET title=$1, description=$2, placelocation=$3, category=$4, price=$5, accessibility=$6, dangerous=$7,city=$8 WHERE place_id=$9 AND user_id=$10",
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
        req.user_id,
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
              console.log(err);
              return false;
            }
            //Check if there are new images
            if (req.body.newImages == "true") {
              //Delete the old images from the filesystem
              let images = await pool.query(
                "SELECT url FROM images WHERE place_id=$1",
                [req.body.place_id]
              );
              //Remove all the images related to the place if there are any
              if (images.rows.length) {
                images.rows.forEach((el) => {
                  fs.unlink("./uploads/" + el.url, () => {});
                });
              }
              //Delete the old images from the database
              await pool.query("DELETE FROM images WHERE place_id=$1", [
                data.rows[0].place_id,
              ]);
              //Upload the new images/if none, the forEach would be skipped
              imagesSrc.forEach((el) => {
                pool.query(
                  "INSERT INTO images (place_id,url,date) VALUES ($1,$2,$3)",
                  [data.rows[0].place_id, el, new Date()],
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

server.delete("/place", authorizeToken, async (req, res) => {
  if (!req.body.place_id) {
    res.status(400);
    return false;
  }
  //Check if the user has access to modify the place in any way(is he the owner)
  let allowedQuery = await pool.query(
    "SELECT COUNT(*) FROM places WHERE place_id=$1 AND user_id=$2",
    [req.body.place_id, req.user_id]
  );
  if (!Number(allowedQuery.rows[0].count)) {
    res.status(403).send("You do not own this place");
    return false;
  }
  //After the previous if, the user has accesss
  //Get all the images related to the place
  let images = await pool.query("SELECT url FROM images WHERE place_id=$1", [
    req.body.place_id,
  ]);
  //Remove all the images related to the place if there are any
  if (images.rows.length) {
    images.rows.forEach((el) => {
      fs.unlink("./uploads/" + el.url, () => {});
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
  await pool.query("DELETE FROM places WHERE place_id=$1", [req.body.place_id]);
  res.status(200).send("Place deleted");
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
          ? data.rows.map((el) => "localhost:5000/image/" + el.url)
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
server.get("/user/data", authorizeToken, async (req, res) => {
  let userPlaces = await pool.query(
    `SELECT user_id,places.place_id,title,description,visible,score,placelocation,category,price,accessibility,places.date,city,dangerous,url,username,avatar
FROM places
LEFT JOIN images on images.place_id = places.place_id
WHERE places.user_id = $1`,
    [req.user_id]
  );
  let data = groupBy(userPlaces.rows, "place_id");
  data = Object.keys(data).map((key) => data[key]);
  if (!data.length) {
    res.status(200).send("You have no saved data");
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
        url: el[0].url
          ? el.map((url) => url.url)
          : "No images are provided for this place",
      };
      return {
        data: JSON.stringify(finalData),
        name: `${el[0].place_id}.json`,
      };
    })
  );
  data.forEach((el) => {
    el.map((image) => {
      archivedData.push({
        data: "./uploads/" + image.url,
        type: "file",
        name: image.url,
      });
    });
  });
  let name = `${Math.round(Math.random() * 10000)}.zip`;
  await archive(archivedData, {
    format: "zip",
    output: name,
  });
  await res.status(200).sendFile(`${__dirname}/${name}`);
  await sendMail(
    "Вашите данни",
    "Здравейте, по-долу съм прикачил Вашите данни. Поздрави, Атанас",
    "a.bobev23@acsbg.org",
    [
      {
        filename: name,
        path: `${__dirname}/${name}`,
        cid: "uniq-mailtrap.png",
      },
    ]
  );
  setTimeout(() => {
    fs.unlinkSync(`${__dirname}/${name}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }, 20000);
});

server.get("/place/specific", async (req, res) => {
  if (!Number(req.query.place_id)) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  let user_format = "%L",
    user_id;

  if (req.headers.jwt && authorizeTokenFunc(req.headers.jwt)) {
    user_id = await authorizeTokenFunc(req.headers.jwt);
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
	URL, username,avatar,
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
    let final = groupBy(data.rows, "place_id");
    let finalArray = [];
    //Turn the newly created object of objects into an array of objects for front-end manipulation
    Object.keys(final).forEach(function (key) {
      finalArray.push(final[key]);
    });
    res.status(200).send(finalArray);
  });
});

server.get("/userLikedPlaces", authorizeToken, (req, res) => {
  if (!Number(req.query.limit)) {
    res.status(400).send("Invalid LIMIT sent");
    return false;
  }
  pool.query(
    `SELECT places.place_id, city,avatar,username,
       places.user_id,
       title, 
       description,
       visible,
       score,
       placelocation,
       category,
       price,
       accessibility,
       places.date,
       dangerous,
       url,
       image_id,CASE
					WHEN EXISTS
											(SELECT *
												FROM "savedPlaces"
												WHERE "savedPlaces".PLACE_ID = "favoritePlaces".PLACE_ID
													AND places.USER_ID = $1 ) THEN 'true'
					ELSE 'false'
	END AS SAVED,
 (SELECT COUNT(*) AS likednumber
 FROM "favoritePlaces"
 WHERE "favoritePlaces".place_id=places.place_id),
 (SELECT COUNT(user_id) FROM "favoritePlaces" WHERE places.user_id=128) FROM "favoritePlaces" 
 JOIN places ON places.place_id = "favoritePlaces".place_id LEFT JOIN images ON images.place_id = places.place_id
 LEFT JOIN users ON users.id = places.user_id
 WHERE places.user_id =$1  ORDER BY "favoritePlaces".date DESC
  `,
    [req.user_id],
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
      let final = groupBy(copyObj, "place_id");
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
	ACCESSIBILITY,
	PLACES.DATE,
	DANGEROUS,
	URL,
	IMAGE_ID,
	CASE
					WHEN EXISTS
											(SELECT *
												FROM "favoritePlaces"
												WHERE "favoritePlaces".PLACE_ID = places.PLACE_ID
													AND USER_ID = $1 ) THEN 'true'
					ELSE 'false'
	END AS liked,
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
    [req.user_id],
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
      let final = groupBy(copyObj, "place_id");
      let finalArray = [];
      //Turn the newly created object of objects into an array of objects for front-end manipulation
      Object.keys(final).forEach(function (key) {
        finalArray.push(final[key]);
      });
      res.status(200).send(finalArray.slice(0, req.query.limit).reverse());
    }
  );
});

server.post("/userPlaces", authorizeToken, (req, res) => {
  if (!(req.body.limit !== undefined && req.body.offset !== undefined)) {
    res.status(400).send("Invalid data sent");
    return false;
  }
  pool.query(
    `SELECT places.place_id,avatar,places.user_id,city,title,description,visible,score,placelocation,category,price,accessibility,places.date,dangerous,url,image_id,(SELECT COUNT(*) AS likednumber FROM "favoritePlaces" WHERE "favoritePlaces".place_id=places.place_id), CASE WHEN EXISTS (select * from "favoritePlaces" where "favoritePlaces".place_id = places.place_id AND user_id=$1 LIMIT  $2 OFFSET $3) THEN 'true' ELSE 'false' END AS liked, CASE WHEN EXISTS (select * from "savedPlaces" where "savedPlaces".place_id = places.place_id AND user_id=$1 LIMIT $2 OFFSET $3 ) THEN 'true' ELSE 
    'false' END as saved FROM (SELECT *,(SELECT COUNT(*) AS LIKEDNUMBER
    FROM "favoritePlaces"
    WHERE "favoritePlaces".PLACE_ID = PLACES.PLACE_ID)
    FROM PLACES ORDER BY likednumber DESC, places.date DESC LIMIT $2 OFFSET $3) places 
    LEFT JOIN images ON images.place_id = places.place_id 
    LEFT JOIN users ON places.user_id = users.id
    WHERE users.id=$1
    ORDER BY likednumber DESC`,
    [req.user_id, req.body.limit, req.body.offset],
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
      //Turn the duplicate objects in the array into single object of objects grouped by the place_id
      const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      let final = groupBy(copyObj, "place_id");
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
  upload.array("images", 1),
  async (req, res) => {
    let imagesSrc = req.files.map((file) => file.filename);
    if (!imagesSrc[0]) {
      res.status(500).send("We couldn't save the avatar");
      return false;
    }
    let previous = await pool.query("SELECT avatar FROM users WHERE id=$1", [
      req.user_id,
    ]);
    fs.unlink("./uploads/" + previous.rows[0].avatar, () => {});
    pool.query(
      "UPDATE users SET avatar = $1 WHERE id=$2",
      [imagesSrc[0], req.user_id],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("We couldn't save the avatar");
          return false;
        }
        res.status(200).send("Everything went successfully");
      }
    );
  }
);
// Login/Register.Account endpoints

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
      if (!Number(data.rowCount)) {
        res.status(400).send("Грешен код");
        return false;
      }
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
            fs.unlink("./uploads/" + el.url, () => {});
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
          await pool.query("DELETE FROM reported_items WHERE user_id=$1", [
            req.user_id,
          ]);
          await pool.query("DELETE FROM places WHERE user_id=$1", [
            req.user_id,
          ]);
          await pool.query("DELETE FROM users WHERE id = $1", [req.user_id]);
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
        console.log(err);
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
            console.log(err);
            res.status(500).send("Internal server error");
            return false;
          }
          if (!result) {
            res.status(401).send("Wrong password");
            return false;
          }
          await pool.query(
            "DELETE FROM verification_actions WHERE user_id=$1 AND type='user-delete'",
            [req.user_id]
          );
          let token = genToken(100);
          pool.query(
            `INSERT INTO public.verification_actions(
            user_id, type, url, date)
            VALUES ($1, $2, $3, $4)`,
            [req.user_id, "user-delete", token, new Date()],
            (err) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal server error");
                return false;
              }
              sendMail(
                `Изтриване на профил`,
                `Поискали сте изтриване на профила. Натиснете линка, за да потвърдите: http://localhost:5000/user/delete/${token} Променете си паролата ако не сте поисквали действието.`,
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

server.post("/register", async (req, res) => {
  if (
    !(
      req.body.username &&
      req.body.password &&
      req.body.email &&
      req.body.username.length <= 20 &&
      req.body.username.length >= 5
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
      "INSERT INTO users (username, email, date, hash, verified, emailsent) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        req.body.username,
        req.body.email,
        new Date(),
        hash,
        token,
        new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
          .toISOString()
          .replace("T", " ")
          .replace("Z", ""),
      ],
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
            "SELECT id from users WHERE username=$1",
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
                req.body.email
              );
              sendEmail(
                "Verify your account",
                `Click the link to verify your account http://localhost:5000/verify/${token}`,
                req.body.email
              );
              res.status(200).send({ jwt: jwtToken });
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
        console.log(err);
        return false;
      }
      if (data.rowCount == 0) {
        res.status(401).send("Линка е грешен");
      } else {
        res.status(401).send("Акаунта е потвърден");
      }
    }
  );
});
server.get("/verified", (req, res) => {
  const userData = authorizeTokenFunc(req.headers.jwt);
  if (!userData) {
    res.status(401).send("No jwt provided!");
    return false;
  }
  pool.query(
    "SELECT verified,email from users where username=$1",
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
          userData.email
        );
        res.status(200).send({ jwt: jwtToken });
        return false;
      } else {
        res.status(403).send("Still unauthorized");
        return false;
      }
    }
  );
});
server.get("/newMail", authorizeToken, (req, res) => {
  pool.query(
    "SELECT email,emailsent,verified FROM users where username=$1",
    [req.user],
    (err, data) => {
      if (err) {
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
      let b = moment(data.rows[0].emailsent); // past email sent
      if (a.diff(b, "minutes") >= 2) {
        sendEmail(
          "Verify your account",
          `Click the link to verify your account http://localhost:5000/verify/` +
            data.rows[0].verified,
          data.rows[0].email
        );
        pool.query(
          "UPDATE users SET emailsent=$1 WHERE username=$2",
          [a, req.user],
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
server.post("/login", async (req, res) => {
  if (!(req.body.username && req.body.password)) {
    res.status(400).send("Invalid request");
    return false;
  }
  pool.query(
    "SELECT hash FROM users WHERE username=$1",
    [req.body.username],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
        return false;
      }
      if (data.rowCount == 0) {
        res.status(409).send("No record associated with the email");
        return false;
      }
      bcrypt.compare(
        req.body.password,
        data.rows[0].hash,
        function (err, result) {
          if (err) {
            console.log(err);
            res.status(500).send("Internal server error");
            return false;
          }
          if (!result) {
            res.status(401).send("Wrong password");
            return false;
          }
          pool.query(
            "SELECT verified,id,email FROM users where username=$1",
            [req.body.username],
            async (err, data) => {
              if (err) {
                console.log(err);
                return false;
              }
              if (!data.rows[0].verified.length) {
                res.status(401).send("Invalid data");
                return false;
              }
              if (data.rows[0].verified == "true") {
                let jwtToken = await generateToken(
                  req.body.username,
                  true,
                  data.rows[0].id,
                  data.rows[0].email
                );
                res.status(200).send({ jwt: jwtToken });
              } else {
                let jwtToken = await generateToken(
                  req.body.username,
                  false,
                  data.rows[0].id,
                  data.rows[0].email
                );
                res.status(200).send({ jwt: jwtToken });
              }
            }
          );
        }
      );
    }
  );
});

// Comments/Replies endpoints

server.post("/comment", authorizeToken, (req, res) => {
  if (!req.body.comment && req.body.place_id) {
    res.status(400).send("Not enough data was provided!");
    return false;
  }
  pool.query(
    "INSERT INTO public.comments(place_id, user_id, content, date, visible, score) VALUES ($1,$2,$3,$4,$5,$6)",
    [
      Number(req.body.place_id),
      req.user_id,
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
      req.user_id,
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
        console.log(err);
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
  if (req.headers.jwt && authorizeTokenFunc(req.headers.jwt)) {
    user_id = await authorizeTokenFunc(req.headers.jwt);
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
WHERE "comments".place_id = $1 AND ("comments".visible=true OR comments_replies.visible=true) ORDER BY "comments".score DESC, comments_replies.date DESC`,
    user_id1,
    user_id2
  );
  pool.query(sql, [req.query.place_id], (err, data) => {
    if (err) {
      console.log(sql, err);
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
  if (!(Number(req.body.type) && req.body.reply_id && req.body.comment_id)) {
    res.status(400).send("Not enough data was provided");
    return false;
  }
  pool.query(
    "SELECT COUNT(*) FROM replies_actions WHERE comment_id=$1 AND user_id=$2 AND action=$3 AND reply_id=$4",
    [req.body.comment_id, req.user_id, req.body.type, req.body.reply_id],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500);
        return false;
      }
      //Check if the same action has already been performed
      if (Number(data.rows[0].count)) {
        console.log("Action already performed");
        if (req.body.type == 1) {
          console.log(
            "Updating the score by by increasing it by one since value has already been decreased. Count is:" +
              data.rows[0].count
          );
          await pool.query(
            `UPDATE public.comments_replies
	SET score=score+1
	WHERE id=$1`,
            [req.body.reply_id]
          );
        } else {
          console.log(
            "Updating the score by decreasing it since value has already been increased"
          );
          await pool.query(
            `UPDATE public.comments_replies
	SET score=score-1
	WHERE id=$1`,
            [req.body.reply_id]
          );
        }
        await pool.query(
          "DELETE FROM replies_actions WHERE user_id=$1 AND reply_id=$2",
          [req.user_id, req.body.reply_id]
        );
      } else {
        console.log("No action has been performed running the following query");
        let sql = format(
          `UPDATE public.comments_replies	SET score=score %s 1	WHERE id=$1`,
          req.body.type == 1 ? "-" : "+"
        );
        await pool.query(sql, [req.body.reply_id]);
        pool.query(
          "SELECT COUNT(*) FROM replies_actions WHERE user_id=$1 AND reply_id=$2",
          [req.user_id, req.body.reply_id],
          async (err, data) => {
            if (err) {
              console.log(err);
              res.status(500).send("Internal server error");
              return false;
            }
            console.log(
              "Checking if there any other records from this user with regards to this comment"
            );
            if (!Number(data.rows[0].count)) {
              console.log("No there aren't");
              await pool.query(
                "INSERT INTO replies_actions(user_id,reply_id,action,comment_id) VALUES($1,$2,$3,$4)",
                [
                  req.user_id,
                  req.body.reply_id,
                  req.body.type,
                  req.body.comment_id,
                ]
              );
            } else {
              console.log("Yes there are. Resetting to a neutral state");
              await pool.query(
                "DELETE FROM replies_actions WHERE user_id=$1 AND reply_id=$2",
                [req.user_id, req.body.reply_id]
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
  if (!(Number(req.body.type) && req.body.comment_id)) {
    res.status(400).send("Not enough data was provided");
    return false;
  }
  pool.query(
    "SELECT COUNT(*) FROM comments_actions WHERE comment_id=$1 AND user_id=$2 AND action=$3",
    [req.body.comment_id, req.user_id, req.body.type],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500);
        return false;
      }
      //Check if the same action has already been performed
      if (Number(data.rows[0].count)) {
        console.log("Action already performed");
        if (req.body.type == 1) {
          console.log(
            "Updating the score by by increasing it by one since value has already been decreased. Count is:" +
              data.rows[0].count
          );
          await pool.query(
            `UPDATE public.comments
	SET score=score+1
	WHERE id=$1`,
            [req.body.comment_id]
          );
        } else {
          console.log(
            "Updating the score by decreasing it since value has already been increased"
          );
          await pool.query(
            `UPDATE public.comments
	SET score=score-1
	WHERE id=$1`,
            [req.body.comment_id]
          );
        }
        await pool.query(
          "DELETE FROM comments_actions WHERE user_id=$1 AND comment_id=$2",
          [req.user_id, req.body.comment_id]
        );
      } else {
        console.log("No action has been performed running the following query");
        let sql = format(
          `UPDATE public.comments	SET score=score %s 1	WHERE id=$1`,
          req.body.type == 1 ? "-" : "+"
        );
        await pool.query(sql, [req.body.comment_id]);
        pool.query(
          "SELECT COUNT(*) FROM comments_actions WHERE user_id=$1 AND comment_id=$2",
          [req.user_id, req.body.comment_id],
          async (err, data) => {
            if (err) {
              console.log(err);
              res.status(500).send("Internal server error");
              return false;
            }
            console.log(
              "Checking if there any other records from this user with regards to this comment"
            );
            if (!Number(data.rows[0].count)) {
              console.log("No there aren't");
              await pool.query(
                "INSERT INTO comments_actions(user_id,comment_id,action) VALUES($1,$2,$3)",
                [req.user_id, req.body.comment_id, req.body.type]
              );
            } else {
              console.log("Yes there are. Resetting to a neutral state");
              await pool.query(
                "DELETE FROM comments_actions WHERE user_id=$1 AND comment_id=$2",
                [req.user_id, req.body.comment_id]
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
server.delete("/comment/delete", authorizeToken, (req, res) => {
  if (!req.body.comment_id) {
    res.status(400).send("Incomplete data");
    return false;
  }
  pool.query(
    "SELECT COUNT(*) FROM comments_replies WHERE id=$1 AND user_id=$2",
    [req.body.comment_id, req.user_id],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (data.rows[0].count) {
        await pool.query("DELETE FROM replies_actions WHERE comment_id=$1", [
          req.body.comment_id,
        ]);
        await pool.query("DELETE FROM comments_actions WHERE comment_id=$1", [
          req.body.comment_id,
        ]);
        await pool.query("DELETE FROM comments_replies WHERE relating=$1", [
          req.body.comment_id,
        ]);
        let final = await pool.query(
          "DELETE FROM comments WHERE user_id = $1 AND id = $2",
          [req.user_id, req.body.comment_id]
        );
        res
          .status(final.rowCount ? 200 : 403)
          .send(`${final.rowCount} rows deleted`);
      } else {
        res.status(403).send("You are unauthorized to delete this comment");
      }
    }
  );
});
server.delete("/reply/delete", authorizeToken, (req, res) => {
  if (!req.body.reply_id) {
    res.status(400).send("Incomplete data");
    return false;
  }
  pool.query(
    "SELECT COUNT(*) FROM comments_replies WHERE id=$1 AND user_id=$2",
    [req.body.reply_id, req.user_id],
    async (err, data) => {
      if (err) {
        res.status(500).send("Internal server error");
        return false;
      }
      if (data.rows[0].count) {
        await pool.query("DELETE FROM replies_actions WHERE reply_id=$1", [
          req.body.reply_id,
        ]);
        let final = await pool.query(
          "DELETE FROM comments_replies WHERE user_id = $1 AND id = $2",
          [req.user_id, req.body.reply_id]
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
    }
  );
});

//Change user data endpoints

server.put("/user/password", authorizeToken, (req, res) => {
  if (
    !req.body.password ||
    req.body.newPassword.length < 8 ||
    !req.body.newPassword
  ) {
    res.status(400).send("Not enough data was provided");
    return false;
  }
  pool.query(
    "SELECT hash FROM users WHERE username=$1",
    [req.user],
    async (err, data) => {
      if (err) {
        console.log(err);
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
            console.log(err);
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
            [req.user_id]
          );
          try {
            encrypt(req.body.newPassword).then((hash) => {
              pool.query(
                `INSERT INTO public.verification_actions(
	user_id, type, url, payload, date)
	VALUES ($1, $2, $3, $4, $5)`,
                [req.user_id, "password", token, hash, new Date()]
              );
              sendMail(
                `Промяна на паролата`,
                `Поискали сте промяна на името. Натиснете линка, за да потвърдите: http://localhost:5000/user/email/${token} Променете си паролата ако не сте поисквали промяна.`,
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
    res.status(400).send("Неверн код");
    return false;
  }
  pool.query(
    "SELECT payload,user_id FROM verification_actions JOIN users on user_id=id WHERE url=$1",
    [req.params.id],
    async (err, data) => {
      if (err) {
        console.log(err);
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
        res.status(200).send("Неверен код");
      }
    }
  );
});

server.put("/user/email", authorizeToken, async (req, res) => {
  if (
    req.body.password == undefined ||
    req.body.email == undefined ||
    req.body.email.length > 50 ||
    req.body.email.length < 5
  ) {
    res.status(400).send("Not enough data was provided.");
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
      bcrypt.compare(req.body.password, data.rows[0].hash, async (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal server error");
          return false;
        }
        let token = genToken(100);
        await pool.query(
          "DELETE FROM verification_actions WHERE user_id=$1 AND type='email'",
          [req.user_id]
        );
        try {
          pool.query(
            `INSERT INTO public.verification_actions(
	user_id, type, url, payload, date)
	VALUES ($1, $2, $3, $4, $5)`,
            [req.user_id, "email", token, req.body.email, new Date()]
          );
          sendMail(
            `Промяна на имейла`,
            `Поискали сте промяна на името. Натиснете линка, за да потвърдите: http://localhost:5000/user/email/${token} Променете си паролата ако не сте поисквали промяна.`,
            req.email
          );
          res.status(200).send("Done");
        } catch (err) {
          res.status(500).send("Internal server error");
        }
      });
    }
  );
});

server.get("/user/email/:id", (req, res) => {
  if (!req.params.id || req.params.id.length !== 200) {
    res.status(400).send("Неверн код");
    return false;
  }
  pool.query(
    "SELECT payload,user_id,email FROM verification_actions JOIN users on user_id=id WHERE url=$1",
    [req.params.id],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      }
      if (Number(data.rowCount) > 0) {
        await pool.query(
          `UPDATE public.users
SET email=$1
WHERE id=$2`,
          [data.rows[0].payload, data.rows[0].user_id]
        );
        res
          .status(200)
          .send(
            "Имейла е променен. Влезнете отново в профила си, за да видите промяната"
          );
        pool.query(
          "DELETE FROM verification_actions WHERE user_id=$1 AND type='email'",
          [data.rows[0].user_id]
        );
      } else {
        res.status(200).send("Неверен код");
      }
    }
  );
});

server.put("/user/name", authorizeToken, async (req, res) => {
  if (
    req.body.name.length > 20 ||
    req.body.name.length < 5 ||
    req.body.name == undefined ||
    req.body.name == req.user
  ) {
    res
      .status(400)
      .send(
        "New name should be provided and it must have over 5 and under 20 characters"
      );
    return false;
  }
  let token = genToken(100);
  let count = await pool.query("SELECT count(*) FROM users WHERE username=$1", [
    req.body.name,
  ]);
  if (Number(count.rows[0].count)) {
    res.status(409).send("Username is already in use");
    return false;
  }
  console.log(count);
  await pool.query(
    "DELETE FROM verification_actions WHERE user_id=$1 AND type='name'",
    [req.user_id]
  );
  pool.query(
    `INSERT INTO public.verification_actions(
     user_id, type, url, payload, date)
    VALUES ($1,$2,$3,$4,$5)`,
    [req.user_id, "name", token, req.body.name, new Date()],
    (err) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        console.log(err);
        return false;
      }
      sendMail(
        `Промяна на името`,
        `Поискали сте промяна на името. Натиснете линка, за да потвърдите: http://localhost:5000/user/name/${token} Променете си паролата ако не сте поисквали промяна.`,
        req.email
      );
      res.status(200).send("Check your email");
    }
  );
});

server.get("/user/name/:id", (req, res) => {
  if (!req.params.id || req.params.id.length !== 200) {
    res.status(400).send("Неверн код");
    return false;
  }
  pool.query(
    "SELECT payload,user_id,username FROM verification_actions JOIN users on user_id=id WHERE url=$1",
    [req.params.id],
    async (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      }
      if (Number(data.rowCount) > 0) {
        await pool.query(
          `UPDATE public.users
SET username=$1
WHERE id=$2`,
          [data.rows[0].payload, data.rows[0].user_id]
        );
        res
          .status(200)
          .send(
            "Името е променено. Влезнете отново в профила си, за да видите промяната"
          );
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

server.listen(5000, () => {
  console.log("The server is up!");
});
