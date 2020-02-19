const express = require('express');
const router = express.Router();

const actions = require('./actions.js');

const { register, accountActivation, signin, readUserInfo, update, requireSignin, adminMiddleware } = actions;
const { registerValidator, signinValidator, runValidation} = require('./validation');

// usersRouter.get('/nikola/', response);
// usersRouter.get('/users/', list);
// usersRouter.get('/users/:id', listOne);
router.post('/register', registerValidator, runValidation, register);
router.post('/account-activation', accountActivation);
router.post('/signin', signinValidator, runValidation, signin);
router.get('/user/:id', requireSignin, readUserInfo);
router.put('/user/update/:id', requireSignin, update);
router.put('/ceo/update/:id', requireSignin, adminMiddleware, update);

// usersRouter.delete('/users/:id', del);
// usersRouter.put('/users/:id', update);
// usersRouter.post('/login/', logIn);
// usersRouter.get('/search/:name', search);

module.exports = router;