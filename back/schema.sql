create database nodeproject CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
create user `nodeproject`@`localhost` identified by 'tnqls1204!';  
grant all privileges on nodeproject.* to `nodeproject`@`localhost` ;
 
CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        nick VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        userType VARCHAR(50),
        time VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE
    posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nick VARCHAR(255) NOT NULL,
        productName VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        price VARCHAR(255),
        manufacturerAndExpiration VARCHAR(255),
        amount VARCHAR(255),
        sellerName VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);