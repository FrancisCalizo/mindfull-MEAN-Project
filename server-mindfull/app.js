const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
// Additional imports
const mongoose      = require("mongoose");
const session       = require('express-session');
const passport      = require('passport');
const cors          = require('cors');


// Connect Mongoose to the DB
mongoose.connect('mongodb://localhost/mindfull');

// Passport Setup
require('./configs/passport-config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add Express-Session Logic
app.use(session({
  secret:"This is a secret, please be MINDFUL!",
  resave: true,
  saveUninitialized: true
}));

// Add Passport Logic
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    credentials: true,                 // allow other domains to send cookies
    origin: ["http://localhost:4200"]  // these are the domains that are allowed
  })
);

// ======== Routes =========== //
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require("./routes/auth-routes");
app.use("/", authRoutes);
const morningfullRoutes = require("./routes/morningfull-routes");
app.use("/", morningfullRoutes);


// =========================== //




module.exports = app;
