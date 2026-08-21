const express = require('express');
const {connectDB} =require('./config/database');
const {User}= require('./models/user')
const app = express();
//middleware to convert from json to javascript object 
app.use(express.json());

app.post("/signup",async (req,res)=>{

try{
    // instance of the model
    const addUser = new User(req.body);
     await addUser.save();
    console.log("Data saved on the database")
    res.send('User successfully signedup');
}catch(error){
    res.status(500).send('error while creating user')
}
   
    
})


connectDB()
.then(()=>{
    console.log("connected to database");
 app.listen(3000, () => {
    console.log("App running on the 3000 port");
  })
}).catch((error)=>{
    console.log("error while connecting the Database")
})
