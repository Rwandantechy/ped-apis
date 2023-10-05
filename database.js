import config from './config.js'
import { MongoClient } from 'mongodb';

const databaseName = "ped";
const collections = {
  blogs: "blogs",
  comments: "comments",
  messages: "messages",
  users: "users",
  replies: "replies",
  reportedblogs: "reportedblogs",
  admins: "admins",
};

const client = new MongoClient( config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectDatabase() {
  try {
    await client.connect();
    console.log(
      "Connected to MongoDB successfully! Database: " + databaseName
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export default function getCollection(collectionName) {
  const validCollectionNames = Object.values(collections);
  
  if (!validCollectionNames.includes(collectionName)) {
    throw new Error(`Invalid collection name: ${collectionName}`);
  }

  return client.db(databaseName).collection(collectionName);
}
 export {getCollection}