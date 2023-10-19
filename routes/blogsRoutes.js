const express = require("express");
const upload = require("../multerConfig.js");
const blogsController = require("../Controllers/blogsController");

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getAllBlogsPaginated,
  getTopBlogs,
  getBlogsByOwner,
} = blogsController;

const router = express.Router();

// Route to create a new blog
router.post("/blogs", upload.single("image"), createBlog);

// Route to get all blogs with pagination
router.get("/blogs/paginated", getAllBlogsPaginated);
// Route to get all blogs
router.get("/blogs", getAllBlogs);

// Route to get a single blog by ID
router.get("/blogs/:id", getBlogById);

// Route to update an existing blog
router.put("/blogs/:id", upload.single("image"), updateBlog);

// Route to delete a blog by ID
router.delete("/blogs/:id", deleteBlog);

//Route to get top 10 blogs with most likes and comments
router.get("/top-blogs", getTopBlogs);

// New route to get blogs by owner
router.get("/blogs/by-owner/:ownerId", getBlogsByOwner);

module.exports = router;
