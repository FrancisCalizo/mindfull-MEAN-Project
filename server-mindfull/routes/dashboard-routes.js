const mongoose      = require("mongoose");
const express       = require("express");

const MorningFull   = require('../models/morningfull');
const EveningFull   = require('../models/eveningfull');

const dashboardRoute  = express.Router();



module.exports = dashboardRoute;