
const jwt = require('jsonwebtoken');
const { User } = require('./../models/user')
async function userAuth(req, res, next) {
  try {
    const cookies = req?.cookies;
    const { token } = cookies;
    if(!token){
      throw new Error("Token is required")
    }
    const isValidUser = jwt.verify(token, "DevBuddy@2026/@@@|||");
    if (!isValidUser) {
      throw new Error('Token is invalid!!!!!!!');
    }
    const userData = await User.findById(isValidUser._id);
    if (!userData) {
      throw new Error("user not found!!!!");
    }
    req.user = userData;
    next();
  }
  catch (error) {
    res.status(400).send("Error:" +error.message);
  }

}

module.exports = { userAuth }