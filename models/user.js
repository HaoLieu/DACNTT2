const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }
}, {
  collection: 'users'
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
