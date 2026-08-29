const mongoose = require('mongoose');

async function connectDB(){
    return await mongoose.connect(process.env.MONGODB_CONNECT_URL);
}

module.exports={connectDB}


