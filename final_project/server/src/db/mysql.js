const mysql = require('mysql');
const mysqlConfigs = require('../config/config.json');
const models = require('../migrations/createTables');



const dbConfig = mysqlConfigs['dev'];
const { usersCreateModel, createUserProfile } = models;
const con = mysql.createConnection(dbConfig);




con.connect(() => {
  console.log('db connection is on');
  con.query(usersCreateModel);
  con.query(createUserProfile);  
});

module.exports = { 
  con 
};