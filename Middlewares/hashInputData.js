import bcrypt from "bcrypt";
// Helper function to hash passwords
export const hashInputData = async (string,) => {
  console.log("string is ", string);
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(string,salt);
};
// Helper function to compare passwords
export const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
