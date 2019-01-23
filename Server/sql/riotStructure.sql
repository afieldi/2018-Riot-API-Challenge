-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: riot-2018
-- ------------------------------------------------------
-- Server version	5.7.21-log

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
  `entity` varchar(80) NOT NULL,
  `date_assigned` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_completed` timestamp NULL DEFAULT NULL,
  `active` enum('ACTIVE','COMPLETED','FAILED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`mission_id`,`entity`),
  KEY `mission_entity_idx` (`entity`),
  CONSTRAINT `mission_entity` FOREIGN KEY (`entity`) REFERENCES `entity` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mission_key` FOREIGN KEY (`mission_id`) REFERENCES `mission` (`mission_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `available_mission`
--

DROP TABLE IF EXISTS `available_mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `available_mission` (
  `mission_id` int(11) NOT NULL,
  `date_assigned` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_expired` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`mission_id`),
  CONSTRAINT `to_mission` FOREIGN KEY (`mission_id`) REFERENCES `mission` (`mission_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clan`
--

DROP TABLE IF EXISTS `clan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan` (
  `entity_id` varchar(80) NOT NULL,
  `points` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`entity_id`),
  UNIQUE KEY `entity_id_UNIQUE` (`entity_id`),
  CONSTRAINT `clan_entity` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=CURRENT_USER*/ /*!50003 TRIGGER `riot-2018`.`clan_AFTER_INSERT` AFTER INSERT ON `clan` FOR EACH ROW
BEGIN
INSERT INTO `riot-2018`.assigned_mission (assigned_mission.mission_id, assigned_mission.entity) SELECT available_mission.mission_id, NEW.entity_id FROM available_mission join mission on (available_mission.mission_id = mission.mission_id) WHERE mission.type = 'CLAN';
INSERT INTO `riot-2018`.leaderboard_entry (leaderboard_entry.leaderboard_id, leaderboard_entry.entity) SELECT leaderboard.leaderboard_id, NEW.entity_id FROM leaderboard WHERE active = 1 AND leaderboard.type='CLAN';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `clan_member`
--

DROP TABLE IF EXISTS `clan_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan_member` (
  `clan_id` varchar(80) NOT NULL,
  `player_id` varchar(80) NOT NULL,
  PRIMARY KEY (`clan_id`,`player_id`),
  KEY `player_i_idx` (`player_id`),
  CONSTRAINT `clan_key` FOREIGN KEY (`clan_id`) REFERENCES `clan` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `player_i` FOREIGN KEY (`player_id`) REFERENCES `player` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clan_war`
--

DROP TABLE IF EXISTS `clan_war`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan_war` (
  `war_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL DEFAULT 'CLAN WAR',
  `status` enum('FINISHED','IN_PROGRESS','SIGN_UP','NOT_STARTED','SET_UP') DEFAULT NULL,
  PRIMARY KEY (`war_id`),
  UNIQUE KEY `war_id_UNIQUE` (`war_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clan_war_entry`
--

DROP TABLE IF EXISTS `clan_war_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan_war_entry` (
  `war` int(11) NOT NULL,
  `player` varchar(80) NOT NULL,
  PRIMARY KEY (`war`,`player`),
  KEY `player_idx` (`player`),
  CONSTRAINT `player` FOREIGN KEY (`player`) REFERENCES `clan_member` (`player_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `war` FOREIGN KEY (`war`) REFERENCES `clan_war` (`war_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clan_war_game`
--

DROP TABLE IF EXISTS `clan_war_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan_war_game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_1` varchar(80) NOT NULL,
  `team_2` varchar(80) NOT NULL DEFAULT '0',
  `war` int(11) NOT NULL,
  `result` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `gameff_idx` (`war`),
  KEY `team_1_idx` (`team_1`),
  KEY `team_2_idx` (`team_2`),
  CONSTRAINT `clan_game` FOREIGN KEY (`war`) REFERENCES `clan_war` (`war_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `team_1` FOREIGN KEY (`team_1`) REFERENCES `clan` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `team_2` FOREIGN KEY (`team_2`) REFERENCES `clan` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=459 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clan_war_member`
--

DROP TABLE IF EXISTS `clan_war_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clan_war_member` (
  `clan_war_game` int(11) NOT NULL,
  `player` varchar(80) NOT NULL,
  `team` enum('0','1') DEFAULT NULL,
  PRIMARY KEY (`clan_war_game`,`player`),
  KEY `player_in_game_idx` (`player`),
  CONSTRAINT `is_clan_game` FOREIGN KEY (`clan_war_game`) REFERENCES `clan_war_game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `player_in_game` FOREIGN KEY (`player`) REFERENCES `clan_war_entry` (`player`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `entity`
--

DROP TABLE IF EXISTS `entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entity` (
  `entity_id` varchar(80) NOT NULL,
  `display_name` varchar(45) NOT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `leaderboard_entry`
--

DROP TABLE IF EXISTS `leaderboard_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leaderboard_entry` (
  `leaderboard_id` int(11) NOT NULL,
  `entity` varchar(80) NOT NULL,
  PRIMARY KEY (`leaderboard_id`,`entity`),
  KEY `leaderboard_key_idx` (`leaderboard_id`),
  KEY `leaderboard_entity_idx` (`entity`),
  CONSTRAINT `leaderboard_entity` FOREIGN KEY (`entity`) REFERENCES `entity` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `leaderboard_key` FOREIGN KEY (`leaderboard_id`) REFERENCES `leaderboard` (`leaderboard_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mission`
--

DROP TABLE IF EXISTS `mission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mission` (
  `mission_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('PLAYER','CLAN') NOT NULL,
  `reward` int(11) NOT NULL DEFAULT '0',
  `repeatable` enum('SINGLE','DAILY','CUSTOM') NOT NULL DEFAULT 'SINGLE',
  `title` varchar(45) DEFAULT NULL,
  `description` longtext,
  `max_progress` int(11) DEFAULT NULL,
  `icon_path` varchar(45) DEFAULT NULL,
  `duration_hours` int(11) DEFAULT NULL,
  `cooldown_time` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player` (
  `entity_id` varchar(80) NOT NULL,
  `account_id` varchar(50) NOT NULL,
  `summoner_id` varchar(50) NOT NULL,
  `points` int(11) DEFAULT '0',
  PRIMARY KEY (`entity_id`),
  CONSTRAINT `entity` FOREIGN KEY (`entity_id`) REFERENCES `entity` (`entity_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=CURRENT_USER*/ /*!50003 TRIGGER `riot-2018`.`player_AFTER_INSERT` AFTER INSERT ON `player` FOR EACH ROW
BEGIN
INSERT INTO `riot-2018`.assigned_mission (assigned_mission.mission_id, assigned_mission.entity) SELECT available_mission.mission_id, NEW.entity_id FROM available_mission join mission on (available_mission.mission_id = mission.mission_id) WHERE TYPE = 'PLAYER';
INSERT INTO `riot-2018`.leaderboard_entry (leaderboard_entry.leaderboard_id, leaderboard_entry.entity) SELECT leaderboard.leaderboard_id, NEW.entity_id FROM leaderboard WHERE active = 1 AND type='PLAYER';
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Dumping events for database 'riot-2018'
--

--
-- Dumping routines for database 'riot-2018'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-01-22 18:15:57
