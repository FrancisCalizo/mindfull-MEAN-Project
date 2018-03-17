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
      photoUrl : req.body.morningPhotoUrl,
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
  // Search database by specific morning ID
  MorningFull.findById(req.params.id, (err, morningFull) => {
    if (err) {
      //res.json(err);
      res.status(500).json({ message: "MorningFull find went bad." });
      return;
    }

      res.status(200).json(morningFull);
    });
});

// Update MorningFull Entry
morningRoute.put('/dashboard/morningfull/edit/:id', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to update the Morningfull." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
  }

  const editMorningFull = {
    date     : req.body.morningDate,
    // user     : req.user._id,
    grateful : req.body.morningGrateful,
    photoUrl : req.body.morningPhotoUrl,
    tasks    : req.body.morningTasks,
    word     : req.body.morningWord
  };

  MorningFull.findByIdAndUpdate(req.params.id, editMorningFull, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Morningfull updated successfully."
    });
  });
});

// delete MorningFull Entry
morningRoute.delete("/dashboard/morningfull/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete the Morningfull Entry." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  MorningFull.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Morningfull has been removed."
    });
  });
});

module.exports = morningRoute;