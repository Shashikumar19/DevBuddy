const express = require('express');
const { connectDB } = require('./config/database');
const { User } = require('./models/user')
const app = express();
//middleware to convert from json to javascript object 
app.use(express.json());

app.post("/signup", async (req, res) => {

    try {
        // instance of the model
        const addUser = new User(req.body);
        await addUser.save();
        console.log("Data saved on the database")
        res.send('User successfully signedup');
    } catch (error) {
        res.status(500).send('error while creating user')
    }


})

//find the user using findById method
app.get('/user', async (req, res) => {
    const _id = req.body._id;

    try {
        console.log(_id);
        const user = await User.findById({ _id:_id });
        if (!user) {
            res.status(404).send("user not found");
        } else {
            res.send(user);
        }

    } catch (error) {
        res.status(500).send('something went wrong')
    }
})
//find the user using findone method
app.get('/user', async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404).send("user not found");
        } else {
            res.send(user);
        }

    } catch (error) {
        res.status(500).send('something went wrong')
    }
})


// find user using find method 
app.get('/user', async (req, res) => {
    const email = req.body.email;

    try {
        console.log(email)
        const user = await User.find({ email: email });
        console.log(user)
        if (user.lenth == 0) {
            res.status("user not found");
        } else {
            res.send(user);
        }

    } catch (error) {
        res.status(500).send('something went wrong')
    }
})

//get all users using find method
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send('something went wrong');
    }
})

connectDB()
    .then(() => {
        console.log("connected to database");
        app.listen(3000, () => {
            console.log("App running on the 3000 port");
        })
    }).catch((error) => {
        console.log("error while connecting the Database")
    })
