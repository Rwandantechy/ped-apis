const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const blogsRoutes = require("./routes/blogsRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");
const swaggerOptions = require("./Documentation/swagger.js");
const { connectDatabase } = require("./database.js");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");


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

module.exports = app;

