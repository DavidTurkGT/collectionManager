const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
////////////////////////////////////////////////////////////////////////////////
const bookSchema = new Schema({
  title: { type: String, required: true, trim: true},
  isbnNumber: { type: Number, unique: true},
  length: { type: Number, required: true},
  chapters: [{
    type: String,
    title: {type: String, trim: true},
    length: Number
  }],
  haveRead: { type: Boolean, require: true},
  author: {
    name: {
      fullname: String,
      firstname: {type: String, required: true},
      lastname: {type: String, required: true}
    },
    address: {
      street: String,
      city: String,
      zip: Number
    }
  }
});

module.exports = bookSchema;