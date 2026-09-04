const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    messageContent: {
        type: String,
        require: true
    }
},{timestamps:true})

const chatSchema = new Schema({
    participants: [{
        type: mongoose.Types.ObjectId,
        required: true
    }], message: [messageSchema]
})


const chatModel = mongoose.model('Chats', chatSchema);
module.exports = chatModel;