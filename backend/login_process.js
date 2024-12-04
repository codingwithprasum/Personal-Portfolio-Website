// login_process.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

// Express session middleware
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport session setup
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, function (token, tokenSecret, profile, done) {
  return done(null, profile);
}));

// Configure GitHub OAuth strategy
passport.use(new GitHubStrategy({
  clientID: 'YOUR_GITHUB_CLIENT_ID',
  clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

// Configure Facebook OAuth strategy
passport.use(new FacebookStrategy({
  clientID: 'YOUR_FACEBOOK_APP_ID',
  clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function (accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Login using OAuth</h1><a href="/auth/google">Login with Google</a><br><a href="/auth/github">Login with GitHub</a><br><a href="/auth/facebook">Login with Facebook</a>');
});

// Google OAuth login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// GitHub OAuth login
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// Facebook OAuth login
app.get('/auth/facebook',
  passport.authenticate('facebook')
);

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// Profile route (protected)
app.get('/profile', isLoggedIn, (req, res) => {
  res.send(`<h1>Hello ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// Start server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
