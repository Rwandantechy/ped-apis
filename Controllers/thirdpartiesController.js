import { model } from "mongoose";

const passport = require("passport");

const googleLogin = (req, res) => {
  // Initiates Google OAuth authentication
  passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "http://www.ped.com/dashboard",
    failureRedirect: "http://www.ped.com/login",
  })(req, res);
};

const googleCallback = (req, res) => {
  // Callback URL after Google authentication
  passport.authenticate("google", {
    successRedirect: "http://www.ped.com/dashboard",
    failureRedirect: "http://www.ped.com/login",
  })(req, res);
};

const githubLogin = (req, res) => {
  // Initiates GitHub OAuth authentication
  passport.authenticate("github", {
    successRedirect: "http://www.ped.com/dashboard",
    failureRedirect: "http://www.ped.com/login",
  })(req, res);
};

const githubCallback = (req, res) => {
  // Callback URL after GitHub authentication
  passport.authenticate("github", {
    successRedirect: "http://www.ped.com/dashboard",
    failureRedirect: "http://www.ped.com/login",
  })(req, res);
};

export const twitterLogin = (req, res) => {
  // Initiates Twitter OAuth authentication
  passport.authenticate("twitter", {
    successRedirect: "http://www.ped.com/dashboard",
    failureRedirect: "http://www.ped.com/login",
  })(req, res);
};

export const twitterCallback = (req, res) => {
  // Callback URL after Twitter authentication
  passport.authenticate("twitter", {
    successRedirect: "http://www.ped.com/dashboard",
    failureRedirect: "http://www.ped.com/login",
  })(req, res);
};

module.exports = {
  googleLogin,
  googleCallback,
  githubLogin,
  githubCallback,
  twitterLogin,
  twitterCallback,
};
