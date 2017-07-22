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

CREATE TABLE `investigation_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;


CREATE TABLE `test_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patientid` int(11) DEFAULT NULL,
  `testid` int(11) DEFAULT NULL,
  `result` varchar(100) DEFAULT NULL,
  `conducteddate` varchar(15) DEFAULT NULL,
  `createddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifieddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patientid` (`patientid`),
  KEY `testid` (`testid`),
  CONSTRAINT `test_results_ibfk_1` FOREIGN KEY (`patientid`) REFERENCES `patients` (`id`),
  CONSTRAINT `test_results_ibfk_2` FOREIGN KEY (`testid`) REFERENCES `tests` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `diagnosis` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `patientid` int(11) DEFAULT NULL,
  `doctorid` int(11) DEFAULT NULL,
  `result` text,
  `createddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patientid` (`patientid`),
  CONSTRAINT `fk_diagnosis_patients` FOREIGN KEY (`patientid`) REFERENCES `patients` (`id`),
  CONSTRAINT `fk_diagnosis_doctors` FOREIGN KEY (`doctorid`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `medicines` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `company` varchar(100) NOT NULL,
  `description` text,
  `price` int(10) NOT NULL,
  `weightinmg` int(10) NOT NULL,
  `totalstockspurchased` integer default 0,
  `totalstocksissued` integer default 0,
  `totalstocksavailable` integer default 0,
  `createddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `medicines_purchase_log` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `medicineid` int(10) NOT NULL,
  `totalweightinmgs` int,
  `price`  long,
  `comments` text,
  `createddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_MPL_MEDICINES` FOREIGN KEY (`medicineid`) REFERENCES `medicines` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `doctors` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `degree` text not NULL,
  `additionaldetails` varchar(15) DEFAULT NULL,
  `createddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `appointments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `patientid` int(11) NOT NULL,
  `doctorid` int(11) NOT NULL,
  `dateofappointment` varchar(15) DEFAULT NULL,
  `timeofappointment` varchar(15) DEFAULT NULL,
  `isactive` tinyint(1) DEFAULT 1,
  `iscancelled` tinyint(1) DEFAULT 0,
  `createddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_APPOINTMENTS_PATIENT` FOREIGN KEY (`patientid`) REFERENCES `patients` (`id`),
  CONSTRAINT `FK_APPOINTMENTS_DOCTOR` FOREIGN KEY (`doctorid`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `medicine_combinations_issued` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `appointmentid` int(10) NOT NULL,
  `name` text,
  `dietaryrestrictions` text default NULL,
  `consumptionmode` text default NULL,
  `timeofmedication` text default NULL,
  `stateformedication` text default NULL,
  `priceperdose` long,
  `totalprice` long,
  `totaldays` int,
  `totaldoses` int,
  `discount` long,
  `additionalcomments` text default NULL,
  `createddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_MCI_APPOINTMENTS` FOREIGN KEY (`appointmentid`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;



CREATE TABLE `medicines_issued` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `combinationid` int(10) NOT NULL,
  `medicineid` int(10) NOT NULL,
  `price` long,
  `weightinmg` int,
  `additionalcomments` text default NULL,
  `createddate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_MCI_MI` FOREIGN KEY (`combinationid`) REFERENCES `medicine_combinations_issued` (`id`),
  CONSTRAINT `FK_MEDICINES_MI` FOREIGN KEY (`medicineid`) REFERENCES `medicines` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

DELIMITER $$


CREATE TRIGGER `updateMedicineOnStockPurchase` 
AFTER INSERT ON `medicines_purchase_log`
FOR EACH ROW 
BEGIN
	 update medicines set totalstockspurchased = totalstockspurchased + new.totalweightinmgs, totalstocksavailable=totalstocksavailable+new.totalweightinmgs where id = new.medicineid ;
END$$

DELIMITER $$

CREATE TRIGGER `updateMCIOnIssueMedicine` 
AFTER INSERT ON `medicines_issued`
FOR EACH ROW 
BEGIN
	 update medicine_combinations_issued set name = (SELECT GROUP_CONCAT(CONCAT(m.name,'(', mi.weightinmg,')') SEPARATOR ', ')
FROM medicines_issued mi inner join medicines m on m.id = mi.medicineid 
where combinationid=0 group by mi.combinationid ) where id = new.combinationid ;
END$$


DELIMITER $$

CREATE TRIGGER `updateMCIOnDeleteIssueMedicine` 
AFTER DELETE ON `medicines_issued`
FOR EACH ROW 
BEGIN
	 update medicine_combinations_issued set name = (SELECT GROUP_CONCAT(CONCAT(m.name,'(', mi.weightinmg,')') SEPARATOR ', ')
FROM medicines_issued mi inner join medicines m on m.id = mi.medicineid 
where combinationid=0 group by mi.combinationid ) where id = old.combinationid ;
END$$

INSERT INTO `gscc`.`investigation_category`
(`code`,
`name`,
`description`)
VALUES
('PHYGEN',
'Physical Examination (General)',
'General physical examination');
INSERT INTO `gscc`.`investigation_category`
(`code`,
`name`,
`description`)
VALUES
('PHYSYS',
'Physical Examination (Systematic)',
'Systematic physical examination');
INSERT INTO `gscc`.`investigation_category`
(`code`,
`name`,
`description`)
VALUES
('CLIINV',
'Clinical Investigation',
'Clinical Investigation');
INSERT INTO `gscc`.`investigation_category`
(`code`,
`name`,
`description`)
VALUES
('SPLINV',
'Special Investigation',
'Special Investigation');

INSERT INTO gscc.users (firstname,lastname,username,password,isAdmin) values ('GSCC','Admin','admin', '$2a$08$Vt3fKqJHuo0QfIXrNvKV6e/uyFC1CBOf4Qmefvn7crFWKaR9D0vNK', true);