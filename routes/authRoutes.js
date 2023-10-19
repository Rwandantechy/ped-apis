const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../Controllers/authController');
const { model } = require('mongoose');

const {
  googleLogin,
  googleCallback,
  githubLogin,
  githubCallback,
  twitterLogin,
  twitterCallback,
} = authController;


// Google OAuth Routes
router.get('/auth/google', googleLogin);
router.get('/auth/google/callback', googleCallback);

// GitHub OAuth Routes
router.get('/auth/github', githubLogin);
router.get('/auth/github/callback', githubCallback);

// Twitter OAuth Routes
router.get('/auth/twitter', twitterLogin);
router.get('/auth/twitter/callback', twitterCallback);

module.exports= router;
