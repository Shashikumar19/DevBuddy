const express = require('express');
const cookiParser = require('cookie-parser')
const { connectDB } = require('./config/database');
const cors = require('cors');
const app = express();

app.use(cors({
    origin:['http://localhost:5173','http://localhost:54496'],
    credentials:true,
}))

app.use(express.json());
app.use(cookiParser());


const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/requests');
const userRoutes = require('./router/user')
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRoutes);

connectDB()
    .then(() => {
        console.log("connected to database");
        app.listen(3000, () => {
            console.log("App running on the 3000 port");
        })
    }).catch((error) => {
        console.log("error while connecting the Database", error.message)
    })
