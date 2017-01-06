CREATE DATABASE `gscc` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `gscc`;

CREATE TABLE `patients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `middlename` varchar(100) DEFAULT NULL,
  `fathersname` varchar(100) DEFAULT NULL,
  `mothersname` varchar(100) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `dateofbirth` date DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `monthlyincome` varchar(100) DEFAULT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `emailid` varchar(100) DEFAULT NULL,
  `mobilenumber` varchar(100) DEFAULT NULL,
  `modifieddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `isadmin` tinyint(1) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;




ALTER TABLE `gscc`.`patients` 
CHANGE COLUMN `dateofbirth` `dateofbirth` VARCHAR(15) NULL DEFAULT NULL ;


INSERT INTO gscc.users (firstname,lastname,username,password,isAdmin) values ('GSCC','Admin','admin', '$2a$08$Vt3fKqJHuo0QfIXrNvKV6e/uyFC1CBOf4Qmefvn7crFWKaR9D0vNK', true);