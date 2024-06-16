const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  sum: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new mongoose.Schema({
  items: [invoiceItemSchema],
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true,
    default: 0 
  },
  total: {
    type: Number,
    required: true
  }
}, {
  collection: 'invoices'
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
