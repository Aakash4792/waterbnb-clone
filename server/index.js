const express = require("express");
const app = express();

const helmet = require("helmet");
const passport = require("passport");
const imageDownloader = require("image-downloader");
const cookieSession = require("cookie-session");
const { Strategy } = require("passport-google-oauth20");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const fs = require("fs");

require("dotenv").config();

const PORT = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY1: process.env.COOKIE_KEY1,
  COOKIE_KEY2: process.env.COOKIE_KEY2,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(
  cors({
    origin: "https://waterbnb-wyxn.onrender.com",
    credentials: true,
  })
);
app.use(helmet());
app.use(
  cookieSession({
    name: "session",
    maxAge: 1000 * 60 * 60 * 24,
    keys: [config.COOKIE_KEY1, config.COOKIE_KEY2],
  })
);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to db!!!");
});

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//save the session to cookie
passport.serializeUser((user, done) => {
  const updateFields = {
    id: user.id,
    email: user.emails[0].value,
    name: user.displayName ? user.displayName : user.emails[0].value,
  };

  User.findOneAndUpdate(
    {
      id: user.id,
    },
    { $set: updateFields },
    {
      upsert: true,
    }
  ).then(() => {
    console.log("user In db");
  });
  done(null, user.id);
});

//read the session from the cookie and set properites in req.user
passport.deserializeUser((id, done) => {
  User.findOne({ id: id })
    .then((user) => {
      //console.log("user in node req.user : ", user);
      done(null, user);
    })
    .catch((err) => {
      console.log("User not found");
    });
});

app.use(passport.initialize());
app.use(passport.session()); // authenticates the session
//cookie with the keys and sets the req.user with the users identity

function checkLoggedIn(req, res, next) {
  //req.user
  const isLoggedIn = req.isAuthenticated() && req.user; // req.isAuthenticated() filled by passport
  if (!isLoggedIn)
    return res.redirect("https://waterbnb-wyxn.onrender.com/login");
  next();
}
app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: true,
  }),
  (req, res) => {
    console.log("Current user is : ", req.user);
    return res.redirect("https://waterbnb-wyxn.onrender.com/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  return res.redirect("https://waterbnb-wyxn.onrender.com/login");
});

app.get("/dummy", (req, res) => {
  return res.json({ data: "data" });
});

app.get("/login", checkLoggedIn, (req, res) => {
  return res.json(req.user);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
  } catch (err) {
    console.log("Image upload by link failed");
  }

  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;
    fs.renameSync(path, newPath);
    const dispPath = newPath.replace("uploads\\", "");
    uploadedFiles.push(dispPath);
  }
  res.json(uploadedFiles);
});

app.post("/places", async (req, res) => {
  const {
    title,
    address,
    addedPhotos: photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  const placeDoc = await Place.create({
    owner: req.user._id,
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  });
  console.log("Place created : ", placeDoc);
  return res.json(placeDoc);
});

app.get("/user-places", async (req, res) => {
  const userId = req.user._id;
  res.json(await Place.find({ owner: userId }));
});

app.put("/places", async (req, res) => {
  console.log("put reqv recv");
  const {
    id,
    title,
    address,
    addedPhotos: photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  const userId = req.user._id;
  console.log("userid ", userId);
  const placeDoc = await Place.findById(id);
  console.log("ownder ", placeDoc.owner);
  if (userId.equals(placeDoc.owner)) {
    console.log("User found");
    placeDoc.set({
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    await placeDoc.save();
    console.log("data updated");
    return res.json("ok");
  }
});

app.get("/places/:id", async (req, res) => {
  const id = req.params["id"];
  console.log(req.params);
  console.log("id : ", id);
  res.json(await Place.findById(id));
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  const userId = req.user._id;
  console.log("userId : ", userId);
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userId,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log("cannot add booking");
      throw err;
    });
});

app.get("/bookings", checkLoggedIn, async (req, res) => {
  const userId = req.user._id;
  res.json(await Booking.find({ user: userId }).populate("place"));
});

app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
