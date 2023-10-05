import express from "express";
const router = express.Router();

// Import controllers
import {
  createComment,
  createReply,
  getCommentsByBlogId,
  getRepliesByCommentId,
} from "../controllers/commentController";

// Create a new comment on a blog post
router.post("/comments", createComment);

// Create a reply to a comment
router.post("/comments/replies", createReply);

// Get comments for a specific blog post
router.get("/comments/:blogId", getCommentsByBlogId);

// Get replies for a specific comment
router.get("/comments/replies/:commentId", getRepliesByCommentId);
// Edit a comment by its ID
router.put("/comments/:commentId", editComment);

// Delete a comment by its ID
router.delete("/comments/:commentId", deleteComment);

export default router;
