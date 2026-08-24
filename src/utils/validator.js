const { User } = require('../models/user');
const Connectionrequest = require('../models/connectionrequest')
const validate = require('validator')
function validateSignup(req) {
    const { firstName, lastName, password, email, gender } = req.body;
    if (!firstName || !lastName) {
        throw new Error('Enter valid first and last name ')
    }
    if (!validate.isEmail(email)) {
        throw new Error("Enter valid email")
    }
    if (!validate.isStrongPassword(password)) {
        throw new Error('Enter strong Password')
    }
    if (!['female', 'male', 'others'].includes(gender.toLowerCase())) {
        throw new Error('Enter valid gender')
    }

}

const validateConnectionRequest = async ({ fromUserId, toUserId, status,res }) => {
    const toUser = await User.findById(toUserId);
    const allowedStatus = ['intrested', 'ignored'];
    if (!allowedStatus.includes(status)) {
       throw new Error('Invalid status please enter correct status')
    }

    if (!toUser) {
        throw new Error('user not found');
    }

    const isValidRequest = await Connectionrequest.findOne(
        {
            $or: [{ fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }]
        });

    if (isValidRequest) {
        throw new Error("connection request already exist");
    }
    return toUser;
}

module.exports = { validateSignup, validateConnectionRequest }