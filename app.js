import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import blogsRoutes from "./Routes/blogsRoutes.js";
import usersRoutes from "./Routes/usersRoutes.js";
import swaggerOptions from "./Documentation/swagger.js";
import { connectDatabase } from "./database.js";
import getCollection from "./database.js"; 

const app = express();
app.use(morgan("dev"));

// Connect to the database
connectDatabase();

// Middleware setup
app.use((req, res, next) => {
  req.blogsCollection = getCollection("blogs");
  next();
});
app.use(express.json());
app.use((req, res, next) => {
  req.commentsCollection = getCollection("comments");
  next();
});

app.use((req, res, next) => {
  req.messagesCollection = getCollection("messages");
  next();
});

app.use((req, res, next) => {
  req.usersCollection = getCollection("users");
  next();
});

// Swagger documentation setup
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);

// Route setup
app.use("/api/v1/ped", blogsRoutes);
app.use("/api", usersRoutes);

// Default route
app.use((req, res, next) => {
  if (req.path === "/") {
    res.send("<h1>Welcome to the PublishEveryDay Backend repository!<h1> ");
  }
});

export default app;
