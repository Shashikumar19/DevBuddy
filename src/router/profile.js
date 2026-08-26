const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/Auth')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
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

profileRouter.patch('/profile/edit/', userAuth, async (req, res) => {
    const payloadData = req.body;
    try {
        const allowedField = ['firstName', 'lastName', 'email', 'gender', 'photoUrl', 'about', 'skill', 'age'];
        const isUpdateAllowed = Object.keys(payloadData).every((key) => allowedField.includes(key));

        if (!isUpdateAllowed) {
            throw new Error("Bad request update not allowed")
        }

        const loggedInUser = req.user;
        Object.keys(payloadData).forEach((key) => {
            loggedInUser[key] = payloadData[key];
        })

        const data = await loggedInUser.save();
        const filtedData = {};
        for (key in data) {
            if (allowedField.includes(key)) {
                filtedData[key] = data[key];
            }

        }
        res.json({ message: 'user updated successfully', data:filtedData })

    } catch (error) {
        res.status(400).send('Error:' + error.message);
    }

})

module.exports = profileRouter;
