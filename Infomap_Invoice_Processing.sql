-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: infomap_invoice_processing
-- ------------------------------------------------------
-- Server version	5.6.43-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_data`
--

DROP TABLE IF EXISTS `auth_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_data` (
  `auth_token` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `auth_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_data`
--

LOCK TABLES `auth_data` WRITE;
/*!40000 ALTER TABLE `auth_data` DISABLE KEYS */;
INSERT INTO `auth_data` VALUES ('zTCmwDelXrrXNvnejP5BeHudlHt0Ut3gtygvDU3JX5rgjT8a5tzKtSED',1,'2023-05-31 16:33:05'),('ssx3iZWYhqCTnO10mp12O63eeU4TM03ntOFvRNMVmUExNlVuOYl5EZ7Y',1,'2023-05-31 17:17:07'),('KgXPcAEFmdhx7oUC7olHnSmayFkFGgUn6dxkRqMzJIAZRax9nh9aD2XU',1,'2023-05-31 17:29:28'),('kBJUSuT9GimSA4uarDPOIRRe1hKuAknFUSqZkcToHoYhnAzTsPTWnqLO',1,'2023-05-31 18:13:48'),('hGDdiXERz831NrU72lkGkcGmEumYGH6XMm4tmm8g8XZi7RnopaWqt5Db',1,'2023-05-31 18:17:50'),('yuviJnT0sFe7Oc6SsYH0ILTgEDJFBKcMtp31YLnklHIhdSpDdHVdrDtY',1,'2023-05-31 19:31:11'),('qh4PHIhUes82fvyUrUD4x9TgFT3IobQRwIuoLWfRqM4udHJTPwR196ob',1,'2023-06-01 15:54:14'),('OcGPi6uCCvOeYbqlb6WpNQq3rLHvZFp8vqY5nn8PgGf6UFZnLVuhYszF',1,'2023-06-03 10:23:32');
/*!40000 ALTER TABLE `auth_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_place`
--

DROP TABLE IF EXISTS `business_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_place` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(5) NOT NULL,
  `name` varchar(30) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_place`
--

LOCK TABLES `business_place` WRITE;
/*!40000 ALTER TABLE `business_place` DISABLE KEYS */;
INSERT INTO `business_place` VALUES (1,'AP00',' Andhra Pradesh B P',1,'2023-06-01 13:46:20',1,'2023-06-03 13:02:28',1,'96b23ba0-0054-11ee-8340-4d56bf427993'),(2,'AS00','Assam B P',0,'2023-06-01 15:55:10',1,'2023-06-01 16:56:45',1,'9634c910-0066-11ee-8340-4d56bf427993'),(3,'DL00','Delhi B P',1,'2023-06-01 17:00:41',1,NULL,NULL,'bd627420-006f-11ee-8340-4d56bf427993'),(4,'GJ00','Gujarat B P',1,'2023-06-03 10:37:54',1,NULL,NULL,'984a5af0-01cc-11ee-a18f-5d117c052b9f'),(5,'HR00','Haryana B P',1,'2023-06-03 10:38:04',1,NULL,NULL,'9e5857d0-01cc-11ee-a18f-5d117c052b9f'),(6,'HP00','Himachal Pradesh B P',1,'2023-06-03 10:38:13',1,NULL,NULL,'a4124140-01cc-11ee-a18f-5d117c052b9f'),(7,'KL00','Kerala B P',1,'2023-06-03 10:38:28',1,NULL,NULL,'aca22e10-01cc-11ee-a18f-5d117c052b9f'),(8,'KL01','Kerala B P - Hospital',1,'2023-06-03 10:38:45',1,NULL,NULL,'b6e01900-01cc-11ee-a18f-5d117c052b9f'),(9,'KL04','Kerala Extraction Trading',1,'2023-06-03 10:39:09',1,NULL,NULL,'c594bf00-01cc-11ee-a18f-5d117c052b9f'),(10,'KL02','Kerala ITDP',1,'2023-06-03 10:39:20',1,NULL,NULL,'cbd4a150-01cc-11ee-a18f-5d117c052b9f'),(11,'KL03','Kerala Tetley Cochin',1,'2023-06-03 10:39:30',1,NULL,NULL,'d202d060-01cc-11ee-a18f-5d117c052b9f'),(12,'MP00','Madhya Padesh B P',1,'2023-06-03 10:39:49',1,NULL,NULL,'dd263950-01cc-11ee-a18f-5d117c052b9f');
/*!40000 ALTER TABLE `business_place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cost_center`
--

DROP TABLE IF EXISTS `cost_center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cost_center` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `description` varchar(30) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cost_center`
--

LOCK TABLES `cost_center` WRITE;
/*!40000 ALTER TABLE `cost_center` DISABLE KEYS */;
INSERT INTO `cost_center` VALUES (1,'JK01','CH Cancel.Cred.memoD',0,'2023-06-01 17:59:52',1,'2023-06-01 18:06:59',1,'01d9f1c0-0078-11ee-8340-4d56bf427993'),(2,'JK00','ISD Maharashtra Business Place',0,'2023-06-01 18:06:09',1,'2023-06-01 18:06:47',1,'e2b23770-0078-11ee-8340-4d56bf427993'),(3,'1476764545','CH Bill.doc. Cred',1,'2023-06-01 18:07:38',1,'2023-06-02 11:59:41',1,'17560420-0079-11ee-8340-4d56bf427993'),(4,'8678768687','ISD Maharashtra Business Place',1,'2023-06-01 18:07:51',1,'2023-06-02 11:59:56',1,'1f4e44d0-0079-11ee-8340-4d56bf427993'),(5,'KL02s','asdsad',0,'2023-06-02 10:34:11',1,'2023-06-02 10:34:23',1,'e972c7c0-0102-11ee-a518-9b50f0ac2da4');
/*!40000 ALTER TABLE `cost_center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gl_account`
--

DROP TABLE IF EXISTS `gl_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gl_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_number` varchar(10) NOT NULL,
  `ledger_description` varchar(30) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gl_account`
--

LOCK TABLES `gl_account` WRITE;
/*!40000 ALTER TABLE `gl_account` DISABLE KEYS */;
INSERT INTO `gl_account` VALUES (1,'24000000','Acco Payable - Domes',1,'2023-06-02 10:30:08',1,'2023-06-02 10:39:47',1,'5853e6c0-0102-11ee-a518-9b50f0ac2da4'),(2,'24001800','SR/IR Clearing',1,'2023-06-02 10:33:19',1,'2023-06-02 10:41:37',1,'ca176fc0-0102-11ee-a518-9b50f0ac2da4');
/*!40000 ALTER TABLE `gl_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gst_master`
--

DROP TABLE IF EXISTS `gst_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gst_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tax_code` varchar(10) NOT NULL,
  `description` varchar(50) NOT NULL,
  `cgst` decimal(10,2) NOT NULL,
  `sgst` decimal(10,2) NOT NULL,
  `igst` decimal(10,2) NOT NULL,
  `ugst` decimal(10,2) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gst_master`
--

LOCK TABLES `gst_master` WRITE;
/*!40000 ALTER TABLE `gst_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `gst_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_group`
--

DROP TABLE IF EXISTS `material_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `description` varchar(30) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_group`
--

LOCK TABLES `material_group` WRITE;
/*!40000 ALTER TABLE `material_group` DISABLE KEYS */;
INSERT INTO `material_group` VALUES (1,'1476764545','asdsad ds da',0,'2023-06-02 12:00:26',1,'2023-06-02 12:01:53',1,'f5d067f0-010e-11ee-9825-07495f49c9aa'),(2,'6763454354','HR00 Haryana B P',1,'2023-06-02 12:02:08',1,'2023-06-02 12:08:05',1,'3254f5b0-010f-11ee-9825-07495f49c9aa'),(3,'5464564565','WB00 West Bengal B P',1,'2023-06-02 12:07:52',1,NULL,NULL,'ffa0f5a0-010f-11ee-9825-07495f49c9aa');
/*!40000 ALTER TABLE `material_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plant_type`
--

DROP TABLE IF EXISTS `plant_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plant_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plant_type`
--

LOCK TABLES `plant_type` WRITE;
/*!40000 ALTER TABLE `plant_type` DISABLE KEYS */;
INSERT INTO `plant_type` VALUES (1,'Other receivables1',0,'2023-06-02 16:20:04',1,'2023-06-02 16:22:59',1),(2,'Reverse invoice',1,'2023-06-02 16:20:25',1,'2023-06-02 17:07:54',1),(3,'Other receivables',1,'2023-06-02 16:24:33',1,NULL,NULL);
/*!40000 ALTER TABLE `plant_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profit_center`
--

DROP TABLE IF EXISTS `profit_center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profit_center` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `description` varchar(30) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profit_center`
--

LOCK TABLES `profit_center` WRITE;
/*!40000 ALTER TABLE `profit_center` DISABLE KEYS */;
INSERT INTO `profit_center` VALUES (1,'5676675343','HR00 Haryana B P',1,'2023-06-02 12:59:46',1,'2023-06-02 13:05:32',1,'3fd9ad90-0117-11ee-9825-07495f49c9aa'),(2,'5464564565','sdfdsff',0,'2023-06-02 12:59:59',1,'2023-06-02 13:01:32',1,'47b69e10-0117-11ee-9825-07495f49c9aa'),(3,'1232324353','Invoice processing windows in ',0,'2023-06-02 13:09:58',1,'2023-06-02 13:10:23',1,'ac5c0a20-0118-11ee-9825-07495f49c9aa'),(4,'5676675367','Invoice processing windows in ',1,'2023-06-02 13:10:54',1,'2023-06-02 13:11:09',1,'cde20a50-0118-11ee-9825-07495f49c9aa');
/*!40000 ALTER TABLE `profit_center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchasing_group`
--

DROP TABLE IF EXISTS `purchasing_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchasing_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `description` varchar(30) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchasing_group`
--

LOCK TABLES `purchasing_group` WRITE;
/*!40000 ALTER TABLE `purchasing_group` DISABLE KEYS */;
INSERT INTO `purchasing_group` VALUES (1,'1042389878','A G CONSUMER PRODUCT',0,'2023-06-02 15:32:52',1,'2023-06-02 15:33:36',1,'a33a4d80-012c-11ee-9825-07495f49c9aa'),(2,'1476764545','A G CONSUMER PRODUCT',1,'2023-06-02 15:33:53',1,'2023-06-02 15:39:35',1,'c78d2950-012c-11ee-9825-07495f49c9aa'),(3,'1113860908','A.K THANGAVELU AND BROS',1,'2023-06-02 15:34:12',1,NULL,NULL,'d2b944d0-012c-11ee-9825-07495f49c9aa');
/*!40000 ALTER TABLE `purchasing_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tds_master`
--

DROP TABLE IF EXISTS `tds_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tds_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gl_account_id` int(11) NOT NULL,
  `gst_master_id` int(11) NOT NULL,
  `description` varchar(30) NOT NULL,
  `tax_section` varchar(10) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  `uuid` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tds_master`
--

LOCK TABLES `tds_master` WRITE;
/*!40000 ALTER TABLE `tds_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `tds_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `fullname` varchar(75) NOT NULL,
  `email` varchar(75) NOT NULL,
  `password` varchar(150) NOT NULL,
  `user_type_id` int(11) NOT NULL,
  `mobile` varchar(10) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `last_logged_in` datetime DEFAULT NULL,
  `created_on` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  `modify_on` datetime DEFAULT NULL,
  `modify_by_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'bac3210d-ffa2-11ed-9005-54ee753f9eea','admin','admin@infomapglobal.com','admin123',1,'9999999999',1,'2023-06-03 10:23:32','2023-05-31 16:32:37',1,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_type`
--

DROP TABLE IF EXISTS `user_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `code` varchar(10) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_type`
--

LOCK TABLES `user_type` WRITE;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` VALUES (1,'Administrator','ADM',1);
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-03 13:29:02
