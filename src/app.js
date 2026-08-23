const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookiParser = require('cookie-parser')
const { connectDB } = require('./config/database');
const { User } = require('./models/user')
const { validateSignup } = require('./utils/validator');
const { userAuth } = require('./middleware/Auth')

const app = express();
app.use(express.json());
app.use(cookiParser());

app.post("/signup", async (req, res) => {

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
        console.log("Data saved on the database")
        res.send('User successfully signedup');
    } catch (error) {
        res.status(400).send('Error:' + error.message)
    }
})

app.post('/login', async (req, res) => {
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
        res.send('user login successfull');
    } catch (error) {
        res.status(401).send('Error:' + error)
    }
})

app.get('/profile', userAuth, async (req, res) => {
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

app.post('/sendConnectionRequest', userAuth, (req, res) => {
    const user = req?.user;
    res.send('connection request send: ' + user.firstName + " " + user.lastName);
})

connectDB()
    .then(() => {
        console.log("connected to database");
        app.listen(3000, () => {
            console.log("App running on the 3000 port");
        })
    }).catch((error) => {
        console.log("error while connecting the Database", error.message)
    })
