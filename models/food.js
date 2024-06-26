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
    required: true
  },
  isHidden: {
    type: Boolean,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodCategory',
    required: true
  },
  createdDate: {
    type: String,
    required: true
  }
}, {
  collection: 'foods'
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
