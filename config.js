import dotenv from "dotenv";
import process from "process"; 
dotenv.config();

export default { mongodbURI: process.env.MONGODB_URI };
