import express from 'express';
const router = express.Router();

// Import controllers
import {
  googleLogin,
  googleCallback,
  githubLogin,
  githubCallback,
  twitterLogin,
  twitterCallback,
} from '../Controllers/authController';

// Google OAuth Routes
router.get('/auth/google', googleLogin);
router.get('/auth/google/callback', googleCallback);

// GitHub OAuth Routes
router.get('/auth/github', githubLogin);
router.get('/auth/github/callback', githubCallback);

// Twitter OAuth Routes
router.get('/auth/twitter', twitterLogin);
router.get('/auth/twitter/callback', twitterCallback);

export default router;
