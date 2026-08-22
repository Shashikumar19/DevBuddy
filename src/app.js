const express = require('express');
const bcrypt = require('bcrypt')
const { connectDB } = require('./config/database');
const { User } = require('./models/user')
const { validateSignup } = require('./utils/validator');

const app = express();
app.use(express.json());

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
        res.status(400).send('[Error]:' + error)
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
        const isValidUser = await bcrypt.compare(password, user?.password);
        if (!isValidUser) {
            throw new Error("Invalid Credentials")
        }
        res.send('user login successfull')
    } catch (error) {
        res.status(401).send('[Error]:' + error)
    }
})

// delete user using findByIdAndDelete
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const deleted = await User.findByIdAndDelete(userId);
        console.log(deleted);
        if (!deleted) {
            res.status(404).send('User not found');
        } else {
            res.send('user deleted successfully');
        }

    } catch (error) {
        res.status(500).send('something went wrong')
    }


})

// app.patch('/user', async (req, res) => {
//     const data = req.body;
//     const email = req.body.email;
//     try {
//         const updatUser = await User.findOneAndUpdate({email}, data,{returnDocument:"after"});
//         console.log("--+++>",updatUser)
//         res.send(updatUser)
//     } catch (error) {
//         console.log(error)
//         res.status(500).send("something went wrong")
//     }
// })
// Update using findByIdAndUpdate
app.patch('/user/:userId', async (req, res) => {
    const data = req.body;
    const userId = req.params?.userId;

    try {
        const alloweddata = ['age', 'gender', 'photoUrl', 'about', 'skill'];
        const updateAllowed = Object.keys(data).every((key) => alloweddata.includes(key));

        if (!updateAllowed) {
            throw new Error("Update is not allowed")
        }
        if (data?.skill.length > 10) {
            throw new Error('maximum skill allowed is 10')
        }
        const updatUser = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true });
        console.log("-->", updatUser)
        res.send(updatUser)
    } catch (error) {
        console.log(error)
        res.status(400).send("[Error]:" + error)
    }
})
//find the user using findById method
app.get('/user', async (req, res) => {
    const _id = req.body.userId;

    try {
        console.log(_id);
        const user = await User.findById(_id);
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
        console.log("error while connecting the Database", error.message)
    })
