const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Teacher', 'Student', 'Admin'],
        default: 'Student' 
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    birthday:{
        type: String,
        required: true
    },
    placeofbirth:{
        type: String,
        required: true
    },
    //If the object is a student:
    sclass:{
        type: String,
        require: false,
    },
    //If the object is a Teacher:
    subjects:{
        type: Array
    }
  });

  const User = mongoose.model('User', userSchema)

  module.exports = User;