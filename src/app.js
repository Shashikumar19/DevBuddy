console.log("starting the application");
const express = require('express');
const app = express();

//request handler
app.use('/hello',(req,res)=>{
res.send('Hello world');
})

app.use('/test',(req,res)=>{
    res.send('test is Passed')
})

app.use('/latest',(req,res)=>{
    res.send('Latest Express')
})
app.listen(3000,()=>{
    console.log("App running on the 3000 port");
})