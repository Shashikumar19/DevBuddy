console.log("starting the application");
const express = require('express');
const { userAuth, adminAuth } = require('./middleware/middleware')
const app = express();

//request handler
// multiple route handlers
app.use('/', (error, req, res, next) => {

    if (error) {
        res.send('Something went wrong')
    }
})

app.get('/user', (req, res, next) => {

    // throw Error('Intentailnal error')
    // res.send('user_Loged in successfully');
    next();
})

app.get('/user',(req,res)=>{
    res.send("resolved")
})

app.use('/', (error, req, res, next) => {

    if (error) {
        res.status(500).send('Something went wrong')
    }
})



app.listen(3000, () => {
    console.log("App running on the 3000 port");
})