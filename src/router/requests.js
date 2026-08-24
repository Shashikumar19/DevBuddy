const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const Connectionrequest = require('../models/connectionrequest');
const { validateConnectionRequest } = require('../utils/validator');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

    try {
        const fromUserId = req?.user?._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const toUser = await validateConnectionRequest({ fromUserId, toUserId, status, res })
        const connectionRequest = new Connectionrequest({ fromUserId, toUserId, status });
        await connectionRequest.save();
        res.json({ message: `${req.user.firstName} is sent connection request to ${toUser.firstName} successfully!` });
    } catch (error) {
        res.status(406).json({ message: error.message })
    }

})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'status not valid' })
        }

        const connectionRequestData = await Connectionrequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'intrested'
        })
       if(!connectionRequestData){
        return res.json({message:'Connection does not exist '})
       }
        connectionRequestData.status = status;
        const data = await connectionRequestData.save()
        return res.json({ message: `connection request ${status} successfully`, data })
    } catch (error) {
        res.json({ message: error.message })
    }

})
module.exports = requestRouter;