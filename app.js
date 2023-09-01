import express from "express";
const app = express();
import morgan from "morgan";

app.use((req, res, next) => {
  if (req.path === "/") {
    res.send("Welcome to the homepage");
  } else {
    res.status(404).json("no such resource");
  }
});

app.use('/api',(error, req, res, next) => {
  res.send('Welcome to the API');
  res.json({
    error: { message: error.message },
  });
});

export default app;