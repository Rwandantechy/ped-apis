const express = require("express");
const router = express.Router();

// Import controllers
const usersController = require("../Controllers/usersController");

const {
  createUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById,
  followUser,
  unfollowUser,
  reportContent,
  searchUsersWithBlogs,
  verifyUser,
  userEmailVerified,
} = usersController;

// Create a user (user registration )
router.post("/signup", createUser);
//verify user with unique token
router.get("/verify/:sentUserId/:token", verifyUser);
//verified user route
router.get("/verified/:query", userEmailVerified);
// Login a user
router.post("/login", loginUser);
// Get a user by ID
router.get("/users/:id", getUserById);
// Update a user by ID
router.put("/users/:id", updateUserById);
// Delete a user by ID
router.delete("/users/:id", deleteUserById);
// Follow a user
router.post("/users/:userId/follow", followUser);
// Unfollow a user
router.post("/users/:userId/unfollow", unfollowUser);
// Report content
router.post("/report-content", reportContent);
// Search for user and get their activities
router.get("/search", searchUsersWithBlogs);

module.exports = router;
