const mongoose = require('mongoose');
const Schema   = require('mongoose');

const EveningFullSchema = new Schema ({
  date: {
    type: String,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  accomplishments: [{
    type: String
  }],
  learn: [{
    type: String
  }],
  different: String,
  Rating: Number,
  // This will be a file upload using Multer
  photoPath: String,
  word: String
});

const EveningFull = mongoose.model('EveningFull', EveningFullSchema);

module.exports = EveningFull;