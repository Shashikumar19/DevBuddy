const express = require('express');
const { userAuth } = require('../middleware/auth');
const chatModel = require('../models/chat');
const chatRouter = express.Router();

chatRouter.get('/chat/:targetUser', userAuth, async (req, res) => {

    try {
        const user = req.user;
        const { targetUser } = req.params;

        let chat = await chatModel.findOne({
            participants: {
                $all: [user._id, targetUser]
            }
        }).populate({
            path: "message.senderId",
            select: 'firstName lastName photoUrl'
        })

        if (!chat) {
            chat = new chatModel({
                participants: [user, targetUser],
                message: []
            })
        }

        await chat.save();

        const chatList = chat?.message?.map(raw => {
            const { senderId, messageContent } = raw;
            const { firstName, lastName, photoUrl } = senderId;
            return {
                firstName,
                lastName,
                photoUrl,
                message: messageContent
            }
        })

        return res.json({ message: 'chat fetched successfully', messages:chatList })


    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})

module.exports = chatRouter;