import express from "express";
// Your Express route handling
const router = express.Router();

/**
 * @swagger
 * ${blog.paths['/blogs'].post.summary}
 * ${blog.paths['/blogs'].post.responses}
 */
router.post("/", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs'].get.summary}
 * ${blog.paths['/blogs'].get.responses}
 */
router.get("/", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs/{id}'].get.summary}
 * ${blog.paths['/blogs/{id}'].get.parameters}
 * ${blog.paths['/blogs/{id}'].get.responses}
 */
router.get("/:id", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs/{id}'].put.summary}
 * ${blog.paths['/blogs/{id}'].put.parameters}
 * ${blog.paths['/blogs/{id}'].put.responses}
 */
router.put("/:id", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs/{id}'].delete.summary}
 * ${blog.paths['/blogs/{id}'].delete.parameters}
 * ${blog.paths['/blogs/{id}'].delete.responses}
 */
router.delete("/:id", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs/{id}/comments'].post.summary}
 * ${blog.paths['/blogs/{id}/comments'].post.parameters}
 * ${blog.paths['/blogs/{id}/comments'].post.responses}
 */
router.post("/:id/comments", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs/{id}/comments'].get.summary}
 * ${blog.paths['/blogs/{id}/comments'].get.parameters}
 * ${blog.paths['/blogs/{id}/comments'].get.responses}
 */
router.get("/:id/comments", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs/{blogId}/comments/{commentId}'].put.summary}
 * ${blog.paths['/blogs/{blogId}/comments/{commentId}'].put.parameters}
 * ${blog.paths['/blogs/{blogId}/comments/{commentId}'].put.responses}
 */
router.put("/:blogId/comments/:commentId", async (req, res, next) => {
  // Your route logic here
});

/**
 * @swagger
 * ${blog.paths['/blogs/{blogId}/comments/{commentId}'].delete.summary}
 * ${blog.paths['/blogs/{blogId}/comments/{commentId}'].delete.parameters}
 * ${blog.paths['/blogs/{blogId}/comments/{commentId}'].delete.responses}
 */
router.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  // Your route logic here
});

export default router;
