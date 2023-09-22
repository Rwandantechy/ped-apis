import express from "express";
const router = express.Router();

router.post("/users/register", async (req, res, next) => {
    // Your route implementation here
  });
  
  router.post("/users/login", async (req, res, next) => {
    // Your route implementation here
  });
  
 
  router.get("/users/:id", async (req, res, next) => {
    // Your route implementation here
  });
 
  router.put("/users/:id", async (req, res, next) => {
    // Your route implementation here
  });
  
  router.delete("/users/:id", async (req, res, next) => {
    // Your route implementation here
  });
  
  export default router;
  