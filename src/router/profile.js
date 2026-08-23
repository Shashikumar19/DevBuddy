const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middleware/Auth')

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const userData = req?.user;
        if (!userData) {
            throw new Error('User Does not Exist')
        }
        res.send(userData);
    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }
})

module.exports=profileRouter;
