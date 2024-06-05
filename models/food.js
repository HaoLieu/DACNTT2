const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    require: true
  }
}, {collection: "food"});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
