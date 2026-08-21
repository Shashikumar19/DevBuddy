const mongoose = require('mongoose');

async function connectDB(){
    return await mongoose.connect('mongodb+srv://rathodshashi2025_db_user:dyPb3GBlioY4EAH1@practicecrud.ahvyikx.mongodb.net/devBuddy');
}

module.exports={connectDB}


