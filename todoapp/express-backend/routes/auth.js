const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User"); // Importing my User model

const router = express.Router(); // Instantiating a new router

const saltRounds = 10;
// Generate keys using a website like https://travistidwell.com/jsencrypt/demo/ put them between `backticks` not "quotes".
// Do NOT commit this to Git
const privateKey = "";

// for every type of request, examine the request body for a password; Then hash the password and store as hashed password
router.use(function (req, res, next) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      req.hashedPassword = hash;
      next(); // pass execution on to the next piece of the middleware
    });
  });
});

// login post handler route:
// If a post request is sent to /login endpoint:
router.post("/login", async function (req, res, next) {
  // If the request body contains username and password properties, find the user
  if (req.body.username && req.body.password) {
    const user = await User.findOne()
      .where("username")
      .equals(req.body.username)
      .exec();
    // If a User is found in the database, matching the username:
    if (user) {
      return bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          // if plaintext password matched the hashed password
          if (result === true) {
            // Generate a JWT token and sign using private key and also user's identifier:
            const token = jwt.sign({ id: user._id }, privateKey, {
              algorithm: "RS256",
            }); // Send back a response with status code 200 after generating a token
            return res
              .status(200)
              .json({ username: user.username, access_token: token });
          } else {
            // If passwords don't match
            return res.status(401).json({ error: "Invalid credentials." });
          }
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    }
    // Return error 401 when user is null
    return res.status(401).json({ error: "Invalid credentials." });
  } else {
    // Return error 400 when response body does not contain userbame or password
    res.status(400).json({ error: "Username or Password Missing" });
  }
});

// register post handler route:
// If a post request is sent to /register endpoint:
router.post("/register", async function (req, res, next) {
  // Ensure all these three pieces of information are sent:
  if (req.body.username && req.body.password && req.body.passwordConfirmation) {
    if (req.body.password === req.body.passwordConfirmation) {
      const user = new User({
        username: req.body.username,
        password: req.hashedPassword,
      });
      // call save() to persist the new user to database, and if something goes wrong, catch the error
      return await user
        .save()
        .then((savedUser) => {
          // I can return a token so after registration, user doesn't have to attempt login
          const token = jwt.sign({ id: user._id }, privateKey, {
            algorithm: "RS256",
          });
          return res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
            access_token: token,
          });
        })
        .catch((error) => {
          return res.status(500).json({ error: "Something went wrong" }); // don't send the actual msg: error: error.message
        });
    }
    res.status(400).json({ error: "Passwords not matching" }); // changed this to 401?
  } else {
    res.status(400).json({ error: "Username or Password Missing" });
  }
});

module.exports = router;
