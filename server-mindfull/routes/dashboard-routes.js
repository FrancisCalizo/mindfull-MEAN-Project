const mongoose      = require("mongoose");
const express       = require("express");

const MorningFull   = require('../models/morningfull');
const EveningFull   = require('../models/eveningfull');

const dashboardRoute  = express.Router();

dashboardRoute.get('/dashboard', (req, res, next) => {
  if (!req.user) {
      res.status(401).json({ errorMessage: 'Not logged in.' });
      return;
  }

  MorningFull.find({ user: req.user._id }, (err, morningEntries) => {
    if (err) {
      res.status(500).json({ message: "Morning find went bad." });
      return;
    } 

    EveningFull.find({ user: req.user._id }, (err, eveningEntries) => {
      if (err) {
        res.status(500).json({ message: "Morning find went bad." });
        return;
      } 
      // Able to Access Both Entries on the Dashboard
      const entries = {
        morningEntries: morningEntries,
        eveningEntries: eveningEntries
      }
      res.status(200).json(entries);
    })
  })
});

module.exports = dashboardRoute;