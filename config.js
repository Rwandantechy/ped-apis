import dotenv from "dotenv";
dotenv.config();

export default { mongodbURI: process.env.MONGODB_URI };
