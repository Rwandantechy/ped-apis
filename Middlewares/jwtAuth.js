// Filename: jwtAuth.js
const jwt = require("jsonwebtoken");
const process = require("process");
// Helper function to generate JWT tokens with user data
const generateAuthToken = (input) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ input }, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
};

const verifyAuthToken = (token) => {
  const secretKey = process.env.JWT_SECRET;
  try {
    const decoded = jwt.verify(token, secretKey, { algorithm: "HS256" });

    // Check if the token has expired
    if (decoded && decoded.exp) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        throw new Error("Token has expired");
      }
    }

    return decoded;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
};
