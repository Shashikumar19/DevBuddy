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

module.exports={validateSignup}