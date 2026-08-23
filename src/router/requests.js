const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middleware/Auth');

requestRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
    const user = req?.user;
    res.send('connection request send: ' + user.firstName + " " + user.lastName);
})

module.exports = requestRouter ;