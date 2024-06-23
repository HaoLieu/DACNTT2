const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    user: [String],
    food: [String],
    foodCategory: [String],
    foodMenu: [String],
    invoice: [String],
    employee: [String],
    role: [String]
  }
});

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;
