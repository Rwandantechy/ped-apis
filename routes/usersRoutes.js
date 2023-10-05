import express from 'express';
const router = express.Router();

// Import controllers
import {
  createUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById,
  followUser,
  unfollowUser,
  reportContent,
  searchUsersWithBlogs,
} from '../controllers/userController';

// Create a user (user registration )
router.post('/signup', createUser);
// Login a user
router.post('/login', loginUser);
// Get a user by ID
router.get('/users/:id', getUserById);
// Update a user by ID
router.put('/users/:id', updateUserById);
// Delete a user by ID
router.delete('/users/:id', deleteUserById);
// Follow a user
router.post('/users/:userId/follow', followUser);
// Unfollow a user
router.post('/users/:userId/unfollow', unfollowUser);
// Report content
router.post('/report-content', reportContent);
// Search for user and get their activities
router.get('/search', searchUsersWithBlogs);
// Google OAuth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirection
  res.redirect('/');
});

// GitHub OAuth
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirection
  res.redirect('/');
});

// Twitter OAuth
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect or respond as needed
  res.redirect('/');
});

export default router;
