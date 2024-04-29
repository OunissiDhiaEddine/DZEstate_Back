
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model('Property', PropertySchema);