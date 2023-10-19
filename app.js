import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import blogsRoutes from "./Routes/blogsRoutes.js";
import usersRoutes from "./Routes/usersRoutes.js";
import swaggerOptions from "./Documentation/swagger.js";
import { connectDatabase } from "./database.js";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";

const app = express();
app.use(morgan("dev"));
connectDatabase();

// Middleware setup

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes configuration
app.use("/api/v1/ped/", blogsRoutes);
app.use("/api/v1/ped/", usersRoutes);

// Swagger documentation setup
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ error: err.message });
});


// Default route
app.use((req, res) => {
  if (req.path === "/") {
    res.send("<h1>Welcome to the PublishEveryDay Backend repository!<h1> ");
  } else {
    res.status(404).json({ error: "Not Found" });
  }
});

export default app;
