const database = require('../../db/mysql.js');



const { con } = database;


function listSingleUser(id) {
    const listingSingleUser = 'SELECT * FROM users, user-profile WHERE id = ?';
      return new Promise((resolve, reject) => {
      con.query(listingSingleUser, [id], (err, results) => {
        if (err) {
          reject(err);
          console.error(err);
        } else {
        resolve(results);
        }
      });
    });
  };


  const readUserInfo = async(req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await listSingleUser(userId);
      console.log('FIND USER BY ID: ', user[0])
      user[0].password = undefined;
      res.status(200).json({success: true, message: `user with email ${user[0].email} is displayed`, body: user[0]});
    } catch(err) {
      res.status(500).json(err.message);
    }
    await next;
  }

  function addProfileInfo(city, state, userId) {
    const addQuery = `INSERT INTO profile (city, state, userId) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      con.query(addQuery, [city, state, userId], (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
        resolve(results);
        }
      });
    });
  }

  const listUserProfile = async(req,res,next) => {
      //const user = await listSingleUser(userId);
      //const userId = user[0].id;
      const userId = req.user.id;
      const { city, state } = req.body;
        try {
            const newProfileData = await addProfileInfo(city, state, userId);
            console.log('new profile data: ', city, state);
            return res.status(200).json({success: true, message: `New profile data for user with id: ${userId} has been added!`, body: {city, state}})
        }catch(err) {
            res.status(500).json(err.message);
          }
          await next;

  }

  function getUserInfo(userId) {
    const addQuery = `SELECT * FROM profile, users WHERE userId = ?`;
    return new Promise((resolve, reject) => {
      con.query(addQuery, [userId], (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
        resolve(results);
        }
      });
    });
  }


  const getUserProfile = async(req,res,next) => {
    //const user = await listSingleUser(userId);
    //const userId = user[0].id;
    const userId = req.user.id;
   // const { city, state } = req.body;
      try {
          const newProfileData = await getUserInfo(userId);
          const { city, state, f_name, l_name, email, role, sector } = newProfileData[0];
          console.log('new profile data: ', city, state, role, f_name, userId);
          return res.status(200).json({success: true, message: `New profile data for user with id: ${userId} has been added!`, body: { city, state, f_name, l_name, email, role, sector }})
      }catch(err) {
          res.status(500).json(err.message);
        }
        await next;

}

module.exports = {
    listUserProfile,
    getUserProfile
}