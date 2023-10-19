const bcrypt = require("bcryptjs");

// Helper function to hash passwords
const hashInputData = async (string) => {
  console.log("string is ", string);
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(string, salt);
};
// Helper function to compare passwords
const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashInputData,
  comparePasswords,
};
