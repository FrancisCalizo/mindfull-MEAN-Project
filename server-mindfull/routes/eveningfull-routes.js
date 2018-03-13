const mongoose      = require('mongoose');
const express       = require('express');
const multer        = require('multer');

const EveningFull   = require('../models/eveningfull');
const eveningRoute  = express.Router();

// multer for photo upload
const myUploader = multer({
  dest: __dirname + "/../public/uploads/"
});

// Create New EveningFull
// NEED TO FIGURE OUT HOW TO HAVE CALENDAR FUNCTIONALITY //
eveningRoute.post('/dashboard/eveningfull/new', (req, res, next) => {

  if (!req.user) {
      res.status(401).json({ errorMessage: 'Not logged in.' });
      return;
  }

  const newEveningFull = new EveningFull({
      date            : req.body.eveningDate,
      user            : req.user._id,
      accomplishments : req.body.eveningAccomplishments,
      learn           : req.body.eveningLearn,
      different       : req.body.eveningDifferent,
      rating          : req.body.eveningRating,
      photoPath       : req.body.eveningPhotoPath,
      word            : req.body.eveningWord
  });

  // Able to post without Photo Being a Requirement******
  if(req.file){
    newEveningFull.photoPath = '/uploads' + req.file.filename;
  }

  newEveningFull.save((err) => {
      if (newEveningFull.errors) {
          res.status(400).json({
              errorMessage: 'Validation failed',
              validationErrors: newEveningFull.errors
          });
          return;
      }

      if (err) {
          console.log('Error POSTING entry', err);
          res.status(500).json({ errorMessage: 'New entry went wrong' })
      }

      res.status(200).json(newEveningFull);
  });
});

// Read eveningFull Single Entry
eveningRoute.get('/dashboard/eveningfull/:id', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see eveningFulls." });
    return;
  }

  // Check if Evening ID is valid 
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Search database by specific evening ID
  EveningFull.findById(req.params.id, (err, eveningFull) => {
    if (err) {
      //res.json(err);
      res.status(500).json({ message: "EveningFull find went bad." });
      return;
    }

      res.status(200).json(eveningFull);
    });
});

// Update EveningFull Entry
eveningRoute.put('/dashboard/eveningfull/edit/:id', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to update the Eveningfull." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
  }

  const editEveningFull = {
    date            : req.body.eveningDate,
    // user            : req.user._id,
    accomplishments : req.body.eveningAccomplishments,
    learn           : req.body.eveningLearn,
    different       : req.body.eveningDifferent,
    rating          : req.body.eveningRating,
    photoPath       : req.body.eveningPhotoPath,
    word            : req.body.eveningWord
  };

    // Upload image
    // if (req.file) {
    //     thePhone.image = '/uploads/' + req.file.filename;
    // }

  EveningFull.findByIdAndUpdate(req.params.id, editEveningFull, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Eveningfull updated successfully."
    });
  });
});

// Delete EveningFull Entry 
eveningRoute.delete("/dashboard/eveningfull/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete the Eveningfull Entry." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  EveningFull.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Eveningfull has been removed."
    });
  });
});

module.exports = eveningRoute;