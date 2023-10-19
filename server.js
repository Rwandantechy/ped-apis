const  port  = require("./config");
const http = require("http");
const app = require("./app");

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server has started and is running on port ${port}`);
});
