const express = require('express');
const router = express.Router();
const { requireSignin } = require('../users/actions');

const actions = require('./actions.js');

// const { register, accountActivation, signin, readUserInfo, update, requireSignin, adminMiddleware } = actions;
// const { registerValidator, signinValidator, runValidation} = require('./validation');
const { listUserProfile, getUserProfile } = actions;
// usersRouter.get('/nikola/', response);
// usersRouter.get('/users/', list);
// usersRouter.get('/users/:id', listOne);
// router.post('/register', registerValidator, runValidation, register);
// router.post('/account-activation', accountActivation);
// router.post('/signin', signinValidator, runValidation, signin);
// router.get('/user/:id', requireSignin, readUserInfo);
// router.put('/user/update/:id', requireSignin, update);
// router.put('/ceo/update/:id', requireSignin, adminMiddleware, update);
    router.post('/profile/:userId', requireSignin, listUserProfile);
    router.get('/profile/get/:userId', requireSignin, getUserProfile)

// usersRouter.delete('/users/:id', del);
// usersRouter.put('/users/:id', update);
// usersRouter.post('/login/', logIn);
// usersRouter.get('/search/:name', search);

module.exports = router;