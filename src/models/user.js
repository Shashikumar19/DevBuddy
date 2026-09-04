const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 24,
        trim: true,
        match: [/^[a-zA-Z ]+$/, "firtname Must contain only charaters"]
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
        validate(data) {
            if (!validator.isStrongPassword(data)) {
                throw new Error('Enter string pasword', data)
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(data) {
            if (!validator.isEmail(data)) {
                throw new Error('Enter valid Email', data);
            };
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    isPremium:{
       type:Boolean,
       default:false
    },membershipType: {
        type:String,
    },
    gender: {
        type: String,
        lowercase: true,
        validate(data) {
            if (!['male', 'female', 'others'].includes(data)) return false
            else
                return true
        }
    },
    photoUrl: {
        type: String,
        default: 'https://img.magnific.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?semt=ais_hybrid&w=740&q=80',
        validate(data) {
            if (!validator.isURL(data)) {
                throw new Error('Enter correct URl', data)
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

}, { timestamps: true })

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DevBuddy@2026/@@@|||", { expiresIn: "7d" });
    return token;
}
userSchema.methods.validatePassword = async function (userPassword) {
    const user = this;
    const hashedPassword = user?.password;
    const isValidUser = await bcrypt.compare(userPassword, hashedPassword);
    return isValidUser;
}


const User = mongoose.model('User', userSchema);

module.exports = { User };