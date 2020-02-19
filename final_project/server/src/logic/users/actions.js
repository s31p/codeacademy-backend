const database = require('../../db/mysql.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const Bluebird = require('bluebird');
//const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { con } = database;
// Bluebird.promisifyAll(jwt);
// Bluebird.promisifyAll(bcrypt);

function allUsers() {
    const users = 'SELECT * FROM users';
      return new Promise((resolve, reject) => {
      con.query(users, (err, results) => {
        if (err) {
          reject(err);
          console.error(err);
        } else {
        resolve(results);
        }
      });
    });
  };
  


 
  
  const register = async (req, res, next) => {
    const { f_name, l_name, email, password, role, sector } = req.body;
    const getAllUsers = await allUsers();
    //const addNewUser = await addUser(f_name, l_name, email, password, role, sector, created_at)
    console.log('get all users', getAllUsers)
    const getUserByEmail = getAllUsers.map(emailInDb => {
       return emailInDb.email == email;
    });
     console.log('check if email exists', getUserByEmail)
    
     if(getUserByEmail.includes(true)) {
        return res.status(400).json({
            error: 'Email is taken!'
        })
     }
    console.log('req email: ', email)
       // const createdAt = new Date(Date.now());

       const salt = bcrypt.genSaltSync(10);
       const getRounds = bcrypt.getRounds(salt);
       const passHash = bcrypt.hashSync(password, getRounds);
       

     const token = jwt.sign({ f_name, l_name, email, passHash, role, sector}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10m'})
     const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
            <h1>Please use the following link to activate your account.</h1>
            <p>${process.env.CLIENT_URL}/activate/${token}</p>
            <hr/>
            <p>This email may contain sensitive information...</p>
            <p>${process.env.CLIENT_URL}</p>
        `
    }
    sgMail.send(emailData).then(sent=> {
        console.log('SIGNUP EMAIL SENT: ', sent);
        return res.json({
            message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
        })
    })
    .catch(err => {
        console.log('EMAIL SENT ERROR: ', err);
       return res.json({
           message: err.message
       })
    })
  }
    

const accountActivation = async (req, res) => {
    const {token} = req.body;

    if(token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decodedToken) {
        if(err){
          console.log('Account activation error: ', err);
                return res.status(401).json({
                    error: 'Expired link. Signup again!'
                  })
        } 
        

        const { f_name, l_name, email, passHash, role, sector} = jwt.decode(token)
       const createdAt = new Date(Date.now());
     //  const salt = Math.round(new Date().valueOf() * Math.random()) + '';
    // const passHash = crypto
    // .createHmac('sha1', salt)
    // .update(password)
    // .digest('hex');
    const addQuery = `INSERT INTO users (f_name, l_name, email, password, role, sector, created_at) VALUES ( ?, ?, ?, ?, ?, ?, ?)`
    return con.query(addQuery, [f_name, l_name, email, passHash, role, sector, createdAt], (err, results) => {
      if (err) {
        console.error(err);
      }
      res.status(201).json({ message: 'Signup success. Please sign in!', data: { f_name, l_name, email, role, sector }})
    });


       })
     }
  
//next();
}


const signin = async(req, res) => {
  const { email, password } = req.body;
  const getAllUsers = await allUsers();
  console.log('get all users', getAllUsers)
  const getUserByEmail = getAllUsers.filter(emailInDb => {
     return emailInDb.email == email;
  });
   console.log('check if email exists', getUserByEmail.length)
  // getUserByEmail returns the user
   if(getUserByEmail.length < 1) {
      return res.status(400).json({
          error: 'The email does not exist in our database. Please register!'
      })
   }
  console.log('req email: ', email)

  const passCheck = bcrypt.compareSync(password, getUserByEmail[0].password);
  
    console.log("COMPARE PASS: ", passCheck)  //true false

  if(getUserByEmail.length >= 1) {
    if(passCheck == false) {

    return res.status(400).json({
        error: 'Email and password do not match! Please check your credentials!'
    })
  }

 const token = jwt.sign({id: getUserByEmail[0].id}, process.env.JWT_SECRET, {expiresIn: '7d'});
const { id, f_name, l_name, email, role, sector } = getUserByEmail[0];
console.log('TESTTTTTTTTTTTTT', f_name)
 return res.status(200).json({
  token,
  user: { id, f_name, l_name, email, role, sector }
})
 }


}


function listSingleUser(id) {
  const listingSingleUser = 'SELECT * FROM users WHERE id = ?';
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
    res.status(200).json({success: true, message: `${user[0].email} data is displayed`, body: user[0]});
  } catch(err) {
    res.status(500).json(err.message);
  }
  await next;
}

function updateUser(user, id) {
  const updateQuery = 'UPDATE users SET f_name = ?, l_name = ?, email = ?, role = ?, sector = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    con.query(updateQuery, [user.f_name, user.l_name, user.email, user.role, user.sector, id], (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
      resolve(results);
      }
    });
  });
};


const update = async(req, res, next) => {
  console.log('req.user: ', req.user, 'req.body: ', req.body)
  console.log('UPDATE USER REQ.PARAMS.ID: ', req.params.id)
  const userId = req.user.id;

  const { f_name, l_name, email, role, sector } = req.body;

  let user2 = {
    id: userId,
    f_name: '',
    l_name: '',
    email: '',
    role: '',
    sector: ''
  }

  try {
    const users = await listSingleUser(userId);
    const userFromDb = users[0];

    
    f_name == '' || f_name == undefined || f_name == null ? user2.f_name = userFromDb.f_name : user2.f_name = f_name;

  
    l_name == '' || l_name == undefined || l_name == null ? user2.l_name = userFromDb.l_name : user2.l_name = l_name;

    
      
        user2.email = userFromDb.email;
        user2.role = userFromDb.role;
        user2.sector = userFromDb.sector;
  
  

    
    const resultFromUpdateDb = await updateUser(user2, userId);
    res.status(200).json({success: true, message: `User with email ${user2.email} has been updated!`, body: user2});
} catch(err) {
  console.log('update err:: ', err)
    res.status(500).json({success: false, message: err.message});
}
await next;

}

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET       //req.user.id    we can access it through this method
});


const adminMiddleware = async(req, res, next) => {
  const userId = req.user.id;
  console.log('Admin middleware userId: ', userId);
  try {
    const user = await listSingleUser(userId);
    console.log('FIND USER BY ID: ', user[0])
    const user2 = user[0];
    if(user2.role !== 'ceo') {
      return res.status(400).json({
        error: 'CEO/Admin resource. Access denied!'
      })
    }
    req.profile = user2;

  } catch(err) {
    res.status(500).json(err.message);
  }
  await next();

}

module.exports = {
    register,
    accountActivation,
    signin,
    readUserInfo,
    update,
    requireSignin,
    adminMiddleware
  }