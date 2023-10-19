/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment on a blog post
 *     description: Create a new comment on a blog post with the provided data.
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blogId:
 *                 type: string
 *                 description: The ID of the blog post.
 *               text:
 *                 type: string
 *                 description: The text of the comment.
 *               token:
 *                 type: string
 *                 description: The authentication token.
 *             required:
 *               - blogId
 *               - text
 *               - token
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 comment:
 *                   type: object
 *                   description: The created comment.
 *       400:
 *         description: Bad request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Create a reply to a comment
/**
 * @swagger
 * /comments/replies:
 *   post:
 *     summary: Create a reply to a comment
 *     description: Create a reply to a comment with the provided data.
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: The ID of the parent comment.
 *               text:
 *                 type: string
 *                 description: The text of the reply.
 *               author:
 *                 type: string
 *                 description: The author of the reply.
 *               token:
 *                 type: string
 *                 description: The authentication token.
 *             required:
 *               - commentId
 *               - text
 *               - author
 *               - token
 *     responses:
 *       201:
 *         description: Reply created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 reply:
 *                   type: object
 *                   description: The created reply.
 *       400:
 *         description: Bad request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Get comments for a specific blog post
/**
 * @swagger
 * /comments/{blogId}:
 *   get:
 *     summary: Get comments for a specific blog post
 *     description: Retrieve comments for a specific blog post by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The ID of the blog post.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized - Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Edit a comment by its ID
/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Edit a comment by its ID
 *     description: Edit a comment by its ID with the provided data.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to edit.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated text of the comment.
 *               token:
 *                 type: string
 *                 description: The authentication token.
 *             required:
 *               - text
 *               - token
 *     responses:
 *       200:
 *         description: Comment edited successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// Delete a comment by its ID
/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment by its ID
 *     description: Delete a comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comment deleted successfully.
 *       401:
 *         description: Unauthorized - Invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
