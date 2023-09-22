import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import blogsRoutes from "./Routes/blogs.js ";
import swaggerOptions from "./Documentation/swagger.js";
const app = express();
app.use(morgan("dev"));
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);
app.use("/api/v1/ped", blogsRoutes);
app.use((req, res, next) => {
  if (req.path === "/") {
    res.send("<h1>Welcome to the PublishEveryDay Backend repository!<h1> ");
  }
});
export default app;
