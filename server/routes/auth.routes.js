// routes/auth.routes.js

const express = require("express");
const bcrypt = require("bcryptjs"); // bcrypt for hashing passwords
const jwt = require("jsonwebtoken"); // JWT for creating tokens
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10; // Define salt rounds for bcrypt

// POST /auth/signup - Registers a new user
router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if email, password, or name is missing
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password, and name" });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Validate password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must be at least 6 characters long and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check if user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // Hash the password and create a new user
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;
      const user = { email, name, _id }; // Omit the password in the response

      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

//routes/auth.routes.js

// POST /auth/login - Authenticates user and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password is empty
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }
  console.log(email, password);
  // Find the user by email
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }
      console.log(foundUser);
      // Compare password with the hashed password in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      console.log(passwordCorrect);
      if (passwordCorrect) {
        const { _id, email, name } = foundUser;
        console.log("password correct", _id, email, name);

        // Create payload and sign the token
        const payload = { _id, email, name };
        console.log(payload);
        console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        console.log("auth token", authToken);
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Internal Server Error" + err })
    );
});

// GET /auth/verify - Checks JWT validity
router.get("/verify", isAuthenticated, (req, res, next) => {
  // Respond with the payload if the token is valid
  res.status(200).json(req.payload);
});

module.exports = router;
