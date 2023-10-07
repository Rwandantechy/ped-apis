import jwt from "jsonwebtoken";

// Helper function to generate JWT tokens with user data
const generateAuthToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ user }, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateAuthToken;