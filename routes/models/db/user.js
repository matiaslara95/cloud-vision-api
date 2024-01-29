// models/User.js
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// const Users = new Schema({
//     username: { type: String, required: true, trim: true },
//     password: { type: String, required: true, trim: true },
// });

const UsersGoogle = new Schema({
    googleId: { type: String, equired: true, trim: true },
    email: { type: String, required: true, trim: true },
    given_name: { type: String, required: true, trim: true },
    family_name: { type: String, required: true, trim: true },
    dateCreate: { type: Date, required: true, trim: true },
    verified_email: { type: Boolean, required: true, trim: true },
});

module.exports = mongoose.model('UsersGoogle', UsersGoogle, 'usersGoogle');
// module.exports = mongoose.model('Users', Users, 'users');