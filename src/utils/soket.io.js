const socket = require('socket.io');
const crypto = require('crypto');
const chatModel = require('../models/chat');
function generateRoomId(targetUser, userId) {
    return crypto.createHash('sha256').update([targetUser, userId].sort().join("_")).digest('hex');
}

function soketInitailization(server) {

    const io = socket(server, {
        cors: {
            origin: 'http://localhost:5173',
        },
    })

    io.on('connection', (socket) => {
        socket.on('chatjoin', ({ targetUser, userId }) => {
            const roomId = generateRoomId(targetUser, userId)
            socket.join(roomId);
        })

        socket.on('sendMessage', async ({ firstName, message, targetUser, userId  }) => {

            const roomId = generateRoomId(targetUser, userId)

            try {
                let chat = await chatModel.findOne({
                    participants: {
                        $all: [targetUser, userId]
                    }
                })

                if (!chat) {
                    chat = new chatModel({
                        participants: [targetUser, userId],
                        message: []
                    })
                }
                chat.message.push({
                    senderId: userId,
                    messageContent: message
                })
                await chat.save();
                io.to(roomId).emit("messageRecieved", { firstName, message })

            } catch(error) {
              console.log("socket error",error.message)
            }


        })
        socket.on('disconnect', () => {


        })

    })

}

module.exports = soketInitailization;