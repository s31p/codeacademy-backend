// import { Router } from 'express';
// import users from '../users/index';
// import posts from '../posts/index';

// import roles from '../roles/index';
// import departments from '../departments/index';
// import user_profiles from '../user_profiles/index';

const express = require('express');
const router = express.Router();
const users = require('../logic/users/index');
const userProfile = require('../logic/user-profile/index');


router.use(users.routes);
router.use(userProfile.routes);


module.exports = router;