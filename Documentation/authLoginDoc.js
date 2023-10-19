/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: OAuth authentication routes and controllers.
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     description: Initiates Google OAuth authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth login page.
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Callback URL after Google OAuth authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to the appropriate page after authentication.
 */

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Initiate GitHub OAuth authentication
 *     description: Initiates GitHub OAuth authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to GitHub OAuth login page.
 */

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     description: Callback URL after GitHub OAuth authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to the appropriate page after authentication.
 */

/**
 * @swagger
 * /auth/twitter:
 *   get:
 *     summary: Initiate Twitter OAuth authentication
 *     description: Initiates Twitter OAuth authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to Twitter OAuth login page.
 */

/**
 * @swagger
 * /auth/twitter/callback:
 *   get:
 *     summary: Twitter OAuth callback
 *     description: Callback URL after Twitter OAuth authentication.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirect to the appropriate page after authentication.
 */
