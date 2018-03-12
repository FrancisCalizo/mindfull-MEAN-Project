const mongoose    = require('mongoose');
const express     = require('express');
const bcrypt      = require("bcrypt");
const passport    = require('passport');

const User        = require('../models/users');

const authRoutes = express.Router();

authRoutes.post('/signup', (req, res, next) => {
    if(!req.body.signUpUsername || !req.body.signUpPassword){
        res.status(400).json({message: "Please provide both, username and password."});
        return;
    }
    User.findOne({ username: req.body.signUpUsername }, (err, userFromDb)=>{
        
        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }

        if(userFromDb){
            res.status(400).json({message: "Username taken. Choose another one."});
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const scrambledPassword = bcrypt.hashSync(req.body.signUpPassword, salt);
        
        const theUser = new User({
           username: req.body.signUpUsername,
           encryptedPassword: scrambledPassword 
        });
        theUser.save((err)=> {
            if(err){
                res.status(500).json({message: "Saving user went bad."});
                return;
            }
            // Automatically log in user after sign up
            req.login(theUser,(err) => {
                if(err){
                    res.status(500).json({message: "Login went bad."});
                    return;
                }
                // Clear the encryptedPassword before sending
                // (not from the database, just from the object)
                // This line of code will save to DB, but clear from PostMan
                theUser.encryptedPassword = undefined;

                // Send the user's information to the frontend
                res.status(200).json(theUser);
            });
        });
      }
    );
});

authRoutes.post('/login', (req, res, next) => {
    const authenticateFunction = passport.authenticate('local', (err, theUser, failureDetails) => {

        if(err){
            re.status(500).json({message: "Unknown error just happened while login."});
            return;
        }
        if (!theUser) {
          // "failureDetails" contains the error messages
          // from our logic in "LocalStrategy" { message: '...' }.
          res.status(401).json(failureDetails);
          return;
        }
        // Login successful, save them in the session.
        req.login(theUser, (err) => {
            if(err){
                res.status(500).json({message:"Session save went bad."});
                return;
            }

            // Clear the encryptedPassword before sending
            // (not from the database, just from the object)
            theUser.encryptedPassword = undefined;

            // Everything worked! Send the user's information to the client.
            res.status(200).json(theUser);
        });
    });
    authenticateFunction(req, res, next);
});

authRoutes.post("/logout", (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

authRoutes.get("/checklogin", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  // Clear the encryptedPassword before sending
  // (not from the database, just from the object)
  req.user.encryptedPassword = undefined;

//   res.status(200).json(req.user);
res.status(401).json({ message: "Unauthorized." });
});

function denyAccess(req, res, next) {
  if (!req.isAuthenticated()) {
    // Ex. If you try to go to a private route and you are logged out.
    res.status(403).json({ message: "LOGGED IN USER ACCESS ONLY!." });
    return;
  }

  next();
}

authRoutes.get("/private", denyAccess, (req, res, next) => {
  res.json({ message: "You are able to access this page because you are logged in." });
});

module.exports = authRoutes;