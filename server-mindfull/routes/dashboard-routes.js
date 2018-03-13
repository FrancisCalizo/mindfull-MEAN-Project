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

  MorningFull.find(
      { user: req.user._id }
  )
  // .limit(7)
  .sort({ date: 1 })
  .exec((err, morningEntries) => {
      if (err) {
          console.log('Error finding entries', err);
          res.status(500).json({ errorMessage: 'Finding entries went wrong'});
          return;
      }

      res.status(200).json(morningEntries);
  });

  EveningFull.find(
    { user: req.user._id }
  )
  // .limit(7)
  .sort({ date: 1 })
  .exec((err, eveningEntries) => {
      if (err) {
          console.log('Error finding entries', err);
          res.status(500).json({ errorMessage: 'Finding entries went wrong'});
          return;
      }

      res.status(200).json(eveningEntries);
  });
});

module.exports = dashboardRoute;