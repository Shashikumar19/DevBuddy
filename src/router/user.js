const express = require('express');
const { userAuth } = require('../middleware/Auth');
const userRoutes = express.Router();
const Connectionrequest = require('../models/connectionrequest');
const { User } = require('../models/user');
const fieldAllowedToView = 'firstName lastName photoUrl about skill gender';

userRoutes.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await Connectionrequest.find({
            toUserId: loggedInUser._id,
            status: 'intrested'
        }).populate('fromUserId', fieldAllowedToView);

        // send only request Recived user data
        const data = connectionRequest.map((raw)=> raw.fromUserId)
        return res.json({ message: 'Data Fetched Successfully', data: data })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})

userRoutes.get('/user/connections', userAuth, async (req, res) => {
    try {  // loggedInuser
        const loggedInUser = req.user;
        //status accepted and check fromuserid and touserid 
        const connections = await Connectionrequest.find(
            {
                $or: [
                    {
                        toUserId: loggedInUser._id,
                        status: 'accepted'
                    }, {
                        fromUserId: loggedInUser._id,
                        status: 'accepted'
                    }]
            }).populate('toUserId', fieldAllowedToView).populate("fromUserId", fieldAllowedToView)

        // validate the from user and repose the data
        const data = connections.map((raw) => raw.fromUserId._id.equals(loggedInUser._id) ? raw.toUserId : raw.fromUserId)
        res.json({ message: 'Connections fetched successfully', data: data })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})


userRoutes.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = req.query?.page;
        let limit = req.query?.limit || 10;

        if (limit > 50) {
            limit = 10;
        }
        const skip = (page - 1) * limit;


        const connections = await Connectionrequest.find(
            { $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }] })

        const hideUserId = new Set();

        connections.forEach((raw) => {
            hideUserId.add(raw.fromUserId.toString());
            hideUserId.add(raw.toUserId.toString());
        })

        const userFeed = await User.find(
            {
                $and: [{
                    _id: {
                        $nin: Array.from(hideUserId)
                    },
                    _id: {
                        $nin: loggedInUser._id
                    }
                }]
            }).select(fieldAllowedToView).skip(skip).limit(limit);

        res.json({ message: 'User Feed Fetched Successfully', data: userFeed })

    } catch (error) {
        res.json({ message: error.message })
    }
})

module.exports = userRoutes;