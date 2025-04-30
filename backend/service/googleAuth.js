const express = require('express');
require('dotenv').config();
const db = require("../db");
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const getOptionMailForUserOnboarding = require('../constant/EmailConstant');
const sendEmail = require('../Utils/SendEmail');
require('dotenv').config();


// Configure cookie session
app.use(
    cookieSession({
        name: 'session',
        keys: ['secretKey'], // Replace with a secure key
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
      {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails[0].value;
            const name = profile.displayName;
            const image = profile.photos[0].value;

            db.query('SELECT * FROM user WHERE email = ?', [email], (err, queryResult) => {
                if (err) {
                    console.error('Error querying the database:', err);
                    return done(err, null);
                }
            
                if (queryResult && queryResult.length > 0) {
                    return done(null, queryResult[0]);
                } else {
                    db.query('INSERT INTO user (email, name, role, image) VALUES (?, ? , ?, ?)', [email, name, "user",image], (err, insertResult) => {
                        if (err) {
                            console.error('Error inserting into the database:', err);
                            return done(err, null);
                        }
                        const userId = insertResult.insertId;
                        db.query('SELECT * FROM user WHERE user_id = ?', [userId], async (err, queryResult) => {
                            if (err) {
                                console.error('Error querying the newly inserted user:', err);
                                return done(err, null);
                            }
                            await sendEmail(getOptionMailForUserOnboarding(name,email));
                            const newUser = queryResult[0];
                            return done(null, newUser);
                        });
                    });
                }
            });            
          } catch (error) {
              console.error('Database error:', error);
              return done(error, null);
          }
      }
  )
);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
      const user = req.user;
      if (user) {
        res.redirect(`${process.env.FRONTENT_DOMAIN}?GoogleAuthentication=true`,301,{GoogleAuthentication:true});
      } else {
        res.status(500).send('Error processing user data');
      }
  }
);


app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).send('Unauthorized');
    }
});

module.exports = app;