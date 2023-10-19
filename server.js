import process from "process"; 
import http from "http"
import app from "./app";
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server has started and is running on port ${port}`);
});