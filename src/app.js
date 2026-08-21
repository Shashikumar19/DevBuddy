console.log("starting the application");
const express = require('express');
const {userAuth,adminAuth} = require('./middleware/middleware')
const app = express();

//request handler
// multiple route handlers

app.get('/user/login',(req,res)=>{
    res.send('user_Loged in successfully')
})
app.use('/admin',adminAuth);
// app.use("/user",userAuth);

app.get('/admin/getAlldata',(req,res,next)=>{
res.send('ALL DATA IS FETCHED')
})

app.get('/admin/deletedData',(req,res,next)=>{
res.send('ALL DATA IS DELETED')
})



app.post('/user/userprofile',userAuth,(req,res)=>{
 res.send('USER DETAILS FETCHED')
})

app.get('/user/userdelete',userAuth,(req,res)=>{
 res.send('USER DELETED')
})






app.get("/abc/:gender/:pass",(req,res)=>{
    const parmas = req.params;
    const queryParams = req.query;
    console.log("params-->",parmas);
    console.log("query params-->",queryParams)
    res.send({name:'abc'})
})

app.post('/user',(req,res)=>{
    res.send('POST API CALL');
})

app.put('/user',(req,res)=>{
    res.send('PUT API CALL');
})

app.patch('/user',(req,res)=>{
    res.send('PATCH API CALL');
})
app.delete('/user',(req,res)=>{
res.send("DELETE API CALL")
})



app.listen(3000,()=>{
    console.log("App running on the 3000 port");
})