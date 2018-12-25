-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: riot-2018
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assigned_mission`
--

DROP TABLE IF EXISTS `assigned_mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assigned_mission` (
  `mission_id` int(11) NOT NULL AUTO_INCREMENT,
  `curent_progress` int(11) DEFAULT '0',
  `max_progress` int(11) DEFAULT NULL,
  `player` int(11) NOT NULL,
  `date_assigned` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_completed` timestamp NULL DEFAULT NULL,
  `active` enum('ACTIVE','COMPLETED','FAILED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`mission_id`),
  KEY `player_mission_key_idx` (`player`),
  CONSTRAINT `mission_key` FOREIGN KEY (`mission_id`) REFERENCES `mission` (`mission_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `player_mission_key` FOREIGN KEY (`player`) REFERENCES `player` (`entity_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_mission`
--

LOCK TABLES `assigned_mission` WRITE;
/*!40000 ALTER TABLE `assigned_mission` DISABLE KEYS */;
/*!40000 ALTER TABLE `assigned_mission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clan`
--

DROP TABLE IF EXISTS `clan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan` (
  `entity_id` int(11) NOT NULL,
  `tag` varchar(45) DEFAULT NULL,
  `points` int(11) DEFAULT '0',
  PRIMARY KEY (`entity_id`),
  CONSTRAINT `entity_key_clan` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`entity_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clan`
--

LOCK TABLES `clan` WRITE;
/*!40000 ALTER TABLE `clan` DISABLE KEYS */;
/*!40000 ALTER TABLE `clan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clan_member`
--

DROP TABLE IF EXISTS `clan_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan_member` (
  `clan_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  PRIMARY KEY (`clan_id`,`player_id`),
  KEY `player_key_idx` (`player_id`),
  CONSTRAINT `clan_key` FOREIGN KEY (`clan_id`) REFERENCES `clan` (`entity_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `player_key` FOREIGN KEY (`player_id`) REFERENCES `player` (`entity_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clan_member`
--

LOCK TABLES `clan_member` WRITE;
/*!40000 ALTER TABLE `clan_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `clan_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity`
--

DROP TABLE IF EXISTS `entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entity` (
  `entity_id` int(11) NOT NULL AUTO_INCREMENT,
  `display_name` varchar(45) NOT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity`
--

LOCK TABLES `entity` WRITE;
/*!40000 ALTER TABLE `entity` DISABLE KEYS */;
INSERT INTO `entity` VALUES (1,'test');
/*!40000 ALTER TABLE `entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaderboard`
--

DROP TABLE IF EXISTS `leaderboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leaderboard` (
  `leaderboard_id` int(11) NOT NULL AUTO_INCREMENT,
  `leaderboard_title` varchar(45) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `type` enum('PLAYER','CLAN') DEFAULT NULL,
  PRIMARY KEY (`leaderboard_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaderboard`
--

LOCK TABLES `leaderboard` WRITE;
/*!40000 ALTER TABLE `leaderboard` DISABLE KEYS */;
INSERT INTO `leaderboard` VALUES (5,'CLAN Leaderboard for Year 2018, Month 11',11,2018,1,'CLAN'),(6,'PLAYER Leaderboard for Year 2018, Month 11',11,2018,1,'PLAYER');
/*!40000 ALTER TABLE `leaderboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaderboard_entry`
--

DROP TABLE IF EXISTS `leaderboard_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leaderboard_entry` (
  `entry_id` int(11) NOT NULL,
  `leaderboard_id` int(11) NOT NULL,
  `entity` int(11) NOT NULL,
  PRIMARY KEY (`entry_id`),
  KEY `player_leaderboard_key_idx` (`entity`),
  KEY `leaderboard_key_idx` (`leaderboard_id`),
  CONSTRAINT `entity_leaderboard_key` FOREIGN KEY (`entity`) REFERENCES `player` (`entity_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `leaderboard_key` FOREIGN KEY (`leaderboard_id`) REFERENCES `leaderboard` (`leaderboard_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaderboard_entry`
--

LOCK TABLES `leaderboard_entry` WRITE;
/*!40000 ALTER TABLE `leaderboard_entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `leaderboard_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mission`
--

DROP TABLE IF EXISTS `mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mission` (
  `mission_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('SOLO','CLAN') NOT NULL,
  `reward` int(11) NOT NULL DEFAULT '0',
  `repeatable` enum('SINGLE','DAILY','CUSTOM') NOT NULL DEFAULT 'SINGLE',
  `title` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `icon_path` varchar(45) DEFAULT NULL,
  `duration_hours` int(11) DEFAULT NULL,
  `cooldown_time` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mission`
--

LOCK TABLES `mission` WRITE;
/*!40000 ALTER TABLE `mission` DISABLE KEYS */;
/*!40000 ALTER TABLE `mission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `past_leaderboard_entry`
--

DROP TABLE IF EXISTS `past_leaderboard_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `past_leaderboard_entry` (
  `leaderboard_entry_id` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`leaderboard_entry_id`),
  CONSTRAINT `leaderboard_entry_key` FOREIGN KEY (`leaderboard_entry_id`) REFERENCES `leaderboard_entry` (`entry_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `past_leaderboard_entry`
--

LOCK TABLES `past_leaderboard_entry` WRITE;
/*!40000 ALTER TABLE `past_leaderboard_entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `past_leaderboard_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player` (
  `entity_id` int(11) NOT NULL,
  `summoner_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT '0',
  PRIMARY KEY (`entity_id`),
  CONSTRAINT `entity_key_player` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`entity_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-25  9:36:00
