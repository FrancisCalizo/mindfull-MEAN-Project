const mongoose      = require("mongoose");
const express       = require("express");

const MorningFull   = require('../models/morningfull');
const morningRoute  = express.Router();


// Create New MorningFull
// NEED TO FIGURE OUT HOW TO HAVE CALENDAR FUNCTIONALITY //
morningRoute.post('/dashboard/morningfull/new', (req, res, next) => {

  if (!req.user) {
      res.status(401).json({ errorMessage: 'Not logged in.' });
      return;
  }

  const newMorningFull = new MorningFull({
      date     : req.body.morningDate,
      user     : req.user._id,
      grateful : req.body.morningGrateful,
      photoURL : req.body.morningPhotoURL,
      tasks    : req.body.morningTasks,
      word     : req.body.morningWord
  });

  newMorningFull.save((err) => {
      if (newMorningFull.errors) {
          res.status(400).json({
              errorMessage: 'Validation failed',
              validationErrors: newMorningFull.errors
          });
          return;
      }

      if (err) {
          console.log('Error POSTING entry', err);
          res.status(500).json({ errorMessage: 'New entry went wrong' })
      }

      res.status(200).json(newMorningFull);
  });
});

// Read MorningFull Single Entry
morningRoute.get('/dashboard/morningfull/:id', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see MorningFulls." });
    return;
  }
  MorningFull.find()
    // retrieve all the info of the owners (needs "ref" in model)
    // don't retrieve "encryptedPassword" though
    .populate('user', { encryptedPassword: 0 })
    .exec((err, morningFull) => {
      if (err) {
        res.status(500).json({ message: "Morningfull find went bad." });
        return;
      }
      res.status(200).json(morningFull);
    });
});


module.exports = morningRoute;