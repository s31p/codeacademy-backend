const usersCreateModel = `
  CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    f_name CHAR(25) NOT NULL,
    l_name CHAR(25) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    created_at DATE,
    updated_at DATE,
    PRIMARY KEY (id)
  )
`;


const createUserProfile = `
    CREATE TABLE IF NOT EXISTS profile (
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      city VARCHAR(255) NOT NULL,
      state VARCHAR(255) NOT NULL,
      userId INT(11) NOT NULL UNIQUE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
`;

module.exports = { 
    usersCreateModel,
    createUserProfile 
};