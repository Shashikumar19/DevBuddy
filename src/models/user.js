const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 24,
        trim: true,
        match: [/^[a-zA-Z]+$/,"firtname Must contain only charaters"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 24,
        trim: true,
        match: /^[a-zA-Z]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 65,
        trim: true,
        validate(data){
            if(!validator.isStrongPassword(data)){
                throw new Error('Enter string pasword',data)
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(data){
            if(!validator.isEmail(data)) {
                throw new Error('Enter valid Email',data);
            };
        }
    },
    age: {
        type: String,
        min: 18,
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        validate(data) {
            if (!['male', 'female', 'others'].includes(data)) return false
            else
                return true
        }
    },
    photoUrl: {
        type: String,
        default: 'https://randomimageurl.com/assets/images/local/20260103_0531_Humorous%20Scene_simple_compose_01ke20wfqtfzt9ykbxzsxxsqzf_compressed_q80.jpeg',
        validate(data){
            if(!validator.isURL(data)){
                  throw new Error('Enter correct URl',data)
            }
        }
    },
    about: {
        type: String,
        minLength: 12,
        maxLength: 250,
        match: /^[a-zA-Z ]+$/,
        default: 'about section you can edit add your bio information'
    },
    skill: {
        type: [String],
        match: /^[a-zA-Z]+$/,
        validate: {
            validator: function (arr) {
                return arr.every(s => /^[a-zA-Z]+$/.test(s));
            },
            message: 'Each skill must contain only letters'
        }
    }

},{timestamps:true})

const User = mongoose.model('User', userSchema);

module.exports = { User };