const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema

const UserSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    avatar:{type:String},
    date:{type:String, default:Date.now}
});

module.exports = mongoose.model('User', UserSchema);
