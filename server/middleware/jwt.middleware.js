// middleware/jwt.middleware.js

const jwt = require("jsonwebtoken");

// Middleware to check if the JWT is valid
const isAuthenticated = (req, res, next) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token and set the payload on req
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.payload = payload;

    next();  // Proceed to the next middleware or route
  } catch (error) {
    res.status(401).json("Token not provided or invalid");
  }
};

module.exports = {
  isAuthenticated,
};