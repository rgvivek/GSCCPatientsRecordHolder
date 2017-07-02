CREATE DATABASE `gscc`;

USE `gscc`;

CREATE TABLE `patients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `middlename` varchar(100) DEFAULT NULL,
  `fathersname` varchar(100) DEFAULT NULL,
  `mothersname` varchar(100) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `dateofbirth` varchar(15) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `monthlyincome` varchar(100) DEFAULT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `emailid` varchar(100) DEFAULT NULL,
  `mobilenumber` varchar(100) DEFAULT NULL,
  `modifieddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


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





CREATE TABLE `patienthistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patientid` int(11) DEFAULT NULL,
  `siblingscount` int(11) DEFAULT NULL,
  `ageofmarriage` int(11) DEFAULT NULL,
  `kidscount` int(11) DEFAULT NULL,
  `maritalstatus` varchar(45) DEFAULT NULL,
  `smoking` varchar(45) DEFAULT NULL,
  `alcohol` varchar(45) DEFAULT NULL,
  `chewing` varchar(45) DEFAULT NULL,
  `eatinghabit` varchar(45) DEFAULT NULL,
  `isdiabetic` tinyint(1) DEFAULT NULL,
  `ishypertensive` tinyint(1) DEFAULT NULL,
  `otherillness` text,
  `pastmedicalhistory` text,
  `currentmedications` text,
  PRIMARY KEY (`id`),
  FOREIGN KEY (patientid) REFERENCES patients(id)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


CREATE TABLE `patientgynaecologicalhistory` (
  `patienthistoryid` int(11) DEFAULT NULL,
  `onsetage` int(11) DEFAULT NULL,
  `stoppedage` int(11) DEFAULT NULL,
  `cycleduration` int(11) DEFAULT NULL,
  `bleedingduration` int(11) DEFAULT NULL,
  `bleedingpain` varchar(45) DEFAULT NULL,
  `ovulationpain` tinyint(1) DEFAULT NULL,
  `menopausereached` tinyint(1) DEFAULT NULL,
  `labourhistory` text,
  KEY `patienthistoryid` (`patienthistoryid`),
  CONSTRAINT `patientgynaecologicalhistory_ibfk_1` FOREIGN KEY (`patienthistoryid`) REFERENCES `patienthistory` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `test_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL unique,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `tests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `testcategory` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `testcategory` (`testcategory`),
  CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`testcategory`) REFERENCES `test_category` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO gscc.users (firstname,lastname,username,password,isAdmin) values ('GSCC','Admin','admin', '$2a$08$Vt3fKqJHuo0QfIXrNvKV6e/uyFC1CBOf4Qmefvn7crFWKaR9D0vNK', true);