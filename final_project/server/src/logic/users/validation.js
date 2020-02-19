const { check, validationResult } = require('express-validator');

const registerValidator = [
    check('f_name')
    .not()
    .isEmpty()
    .withMessage('Your name is required!'),
    check('l_name')
    .not()
    .isEmpty()
    .withMessage('Your last name is required!'),
    check('email')
    .isEmail()
    .withMessage('Your e-email must be valid!'),
    check('password')
    .isLength({min: 6})
    .withMessage('Your password must be at least 6 characters long!')
]

const signinValidator = [
    check('email')
    .isEmail()
    .withMessage('Your e-email must be valid!'),
    check('password')
    .isLength({min: 6})
    .withMessage('Your password must be at least 6 characters long!')
]

const runValidation = (req, res, next) => {
    const errors = validationResult(req);  // if we have a result from the auth.js the result will be an error
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
        //422- unprocessable entity
    }
    next();
}



module.exports = {
    registerValidator,
    signinValidator,
    runValidation
}