const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const MorningFullSchema = new Schema ({
  date: {
    type: String,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  grateful: [{
    type: String
  }],
  tasks: [{
    type: String
  }],
  // This will take URL of image
  photoURL: String,
  word: String
});

const MorningFull = mongoose.model('MorningFull', MorningFullSchema);

module.exports = MorningFull;