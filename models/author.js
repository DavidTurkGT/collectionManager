const mongoose = require('mongoose');
const Schema = mongoose.Schema;
////////////////////////////////////////////////////////////////////////////////
const authorSchema = new Schema({
  name: {
    firstname: {type: String, required: true},
    lastname: {type: String, required: true}
  },
  address: {
    street: String,
    city: String,
    zip: Number
  }
});

module.exports = authorSchema;
