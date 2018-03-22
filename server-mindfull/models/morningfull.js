const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const MorningFullSchema = new Schema ({
  date: {
    type: Date,
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
  photoUrl: String,
  word: String
});

const MorningFull = mongoose.model('MorningFull', MorningFullSchema);

module.exports = MorningFull;