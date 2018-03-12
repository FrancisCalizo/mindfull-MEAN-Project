const mongoose      = require("mongoose");
const express       = require("express");

const MorningFull   = require('../models/morningfull');
const morningRoute  = express.Router();


// Make New MorningFull
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


module.exports = morningRoute;