const express = require('express');
const cookiParser = require('cookie-parser')
const { connectDB } = require('./config/database');

const app = express();
app.use(express.json());
app.use(cookiParser());

const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/requests');
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

connectDB()
    .then(() => {
        console.log("connected to database");
        app.listen(3000, () => {
            console.log("App running on the 3000 port");
        })
    }).catch((error) => {
        console.log("error while connecting the Database", error.message)
    })
