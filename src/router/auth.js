const express = require('express');
const authRouter = express.Router();
const { validateSignup } = require('../utils/validator');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

authRouter.post("/signup", async (req, res) => {

    const { firstName, lastName, password, email, gender } = req.body;

    try {
        validateSignup(req);
        const hashedPassword = await bcrypt.hash(password, 10);
        const addUser = new User({
            firstName,
            lastName,
            password: hashedPassword,
            email,
            gender
        });
        await addUser.save();
        await User.init();
        res.json({ message: 'User successfully signed up' });
    } catch (error) {
        res.status(400).send('Error:' + error.message)
    }
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // check the user existing the existing in the DB
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('user does not exist');
        }
        const isValidUser = await user.validatePassword(password);
        if (!isValidUser) {
            throw new Error("Invalid Credentials")
        }
        const token = await user.getJWT();
        res.cookie('token', token, { expires: new Date(Date.now() + 10 * 3600000), httpOnly: true }); // 8hrs
        res.json({ message: 'logged in successfully', data:user });
    } catch (error) {
        res.status(401).send('Error:' + error)
    }
})

authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' })
})

module.exports = authRouter;