const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        minLength: 4,
        maxLength: 24,
        trim: true,
        match: /^[a-zA-Z]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 25,
        trim: true,
        match: /^[a-zA-Z0-9]+[@]*[a-zA-Z0-9]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/
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