/**
 * @swagger
 * tags:
 *   name: general term blog post but can be any content type.
 *   description: Creates a new blog with the provided data fields .
 *
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog /article/product review or any other content.
 *     description: Create a new piece of content with an optional title, content, and an image. Missing fields won't result in failure.
 *     tags: [Blogs]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the content.
 *               content:
 *                 type: string
 *                 description: Main content with optional embedded images.
 *               image:
 *                 type: string
 *                 format: binary 
 *                 description: Image file for thumbnail or main image.
 *             required:
 *               - title
 *               - content
 *
 *     responses:
 *       201:
 *         description: Content created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 blog:
 *                   type: object
 *                   description: The created content data.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Content unique id The unique identifier.
 *                     title:
 *                       type: string
 *                       description: The title of the blog.
 *                     content:
 *                       type: string
 *                       description: The content of the blog.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the created content.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the created blog.
 *  */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Retrieves a list of all blogs.
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all created blogs retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: An array of blogs.
 *               items:
 *                 type: object
 *                 description: Details about each blog.
 *                 properties:
 *                   metadata:
 *                     type: object
 *                     description: Metadata about the blogs.
 *                     properties:
 *                       count:
 *                         type: integer
 *                         description: The total number of blogs in the list.
 *                       message:
 *                         type: string
 *                         description: A message about the list.
 *                   blog:
 *                     type: object
 *                     description: The blog details.
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the blog.
 *                       title:
 *                         type: string
 *                         description: The title of the blog.
 *                       content:
 *                         type: string
 *                         description: The content of the blog.
 *                   request:
 *                     type: object
 *                     description: Details about how to retrieve each blog.
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: The HTTP request type (GET).
 *                       description:
 *                         type: string
 *                         description: Description of the request.
 *                       url:
 *                         type: string
 *                         description: URL to retrieve the blog.
 */

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     description: Retrieves a single blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the blog.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Details about the retrieved blog.
 *               properties:
 *                 blog:
 *                   type: object
 *                   description: The blog details.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the blog.
 *                     title:
 *                       type: string
 *                       description: The title of the blog.
 *                     content:
 *                       type: string
 *                       description: The content of the blog.
 *                 request:
 *                   type: object
 *                   description: Details about how to delete the blog.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (DELETE).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to delete the blog.
 */

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update an existing blog
 *     description: Updates an existing blog with the provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the blog.
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the blog.
 *               content:
 *                 type: string
 *                 description: New content of the blog.
 *               image:
 *                 type: string
 *                 description: Updated blog image file.
 *             required:
 *               - title
 *               - content
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 blog:
 *                   type: object
 *                   description: The updated blog.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the blog.
 *                     title:
 *                       type: string
 *                       description: The updated title of the blog.
 *                     content:
 *                       type: string
 *                       description: The updated content of the blog.
 *                 request:
 *                   type: object
 *                   description: Details about how to retrieve the updated blog.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (GET).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to retrieve the updated blog.
 */

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     description: Deletes a blog by its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the blog to delete.
 *         schema:
 *           type: string
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 request:
 *                   type: object
 *                   description: Details about how to create a new blog.
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: The HTTP request type (POST).
 *                     description:
 *                       type: string
 *                       description: Description of the request.
 *                     url:
 *                       type: string
 *                       description: URL to create a new blog.
 *                     body:
 *                       type: object
 *                       description: Example request body for creating a new blog.
 *                       properties:
 *                         title:
 *                           type: string
 *                           description: Title of the blog.
 *                         content:
 *                           type: string
 *                           description: Content of the blog.
 *                         image:
 *                           type: string
 *                           description: Blog image file.
 */
