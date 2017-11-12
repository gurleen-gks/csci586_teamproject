# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.20)
# Database: db586
# Generation Time: 2017-11-12 03:03:52 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Anime
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Anime`;

CREATE TABLE `Anime` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `desc` text,
  `type` varchar(200) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `total_episodes` int(10) unsigned DEFAULT NULL,
  `duration` int(10) unsigned DEFAULT NULL,
  `age_rating` varchar(200) DEFAULT NULL,
  `studio_id` int(11) unsigned DEFAULT NULL,
  `licensor_id` int(11) DEFAULT NULL,
  `score_value` float unsigned DEFAULT NULL,
  `broadcast_day` varchar(11) DEFAULT NULL,
  `broadcast_time` time DEFAULT NULL,
  `producer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Anime_Character
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Anime_Character`;

CREATE TABLE `Anime_Character` (
  `anime_id` int(11) unsigned NOT NULL,
  `character_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`anime_id`,`character_id`),
  KEY `character_id` (`character_id`),
  CONSTRAINT `anime_character_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `Anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `anime_character_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `Characters` (`character_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Anime_Genere
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Anime_Genere`;

CREATE TABLE `Anime_Genere` (
  `anime_id` int(11) unsigned NOT NULL,
  `genre_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`anime_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `anime_genere_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `Anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `anime_genere_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `Genres` (`genre_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Anime_Licensor
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Anime_Licensor`;

CREATE TABLE `Anime_Licensor` (
  `anime_id` int(11) unsigned NOT NULL,
  `licensor_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`anime_id`,`licensor_id`),
  KEY `licensor_id` (`licensor_id`),
  CONSTRAINT `anime_licensor_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `Anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `anime_slicensor_ibfk_2` FOREIGN KEY (`licensor_id`) REFERENCES `Licensors` (`licensor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Anime_Producer
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Anime_Producer`;

CREATE TABLE `Anime_Producer` (
  `anime_id` int(11) unsigned NOT NULL,
  `producer_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`anime_id`,`producer_id`),
  KEY `producer_id` (`producer_id`),
  CONSTRAINT `anime_producer_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `Anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `anime_producer_ibfk_2` FOREIGN KEY (`producer_id`) REFERENCES `Producers` (`producer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Anime_Review
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Anime_Review`;

CREATE TABLE `Anime_Review` (
  `anime_id` int(11) unsigned NOT NULL,
  `review_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`anime_id`,`review_id`),
  KEY `review_id` (`review_id`),
  CONSTRAINT `anime_review_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `Anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `anime_review_ibfk_2` FOREIGN KEY (`review_id`) REFERENCES `Reviews` (`review_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Anime_Studio
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Anime_Studio`;

CREATE TABLE `Anime_Studio` (
  `anime_id` int(11) unsigned NOT NULL,
  `studio_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`anime_id`,`studio_id`),
  KEY `studio_id` (`studio_id`),
  CONSTRAINT `anime_studio_ibfk_1` FOREIGN KEY (`anime_id`) REFERENCES `Anime` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `anime_studio_ibfk_2` FOREIGN KEY (`studio_id`) REFERENCES `Studios` (`studio_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Character_Tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Character_Tags`;

CREATE TABLE `Character_Tags` (
  `character_id` int(11) unsigned NOT NULL,
  `tag_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`character_id`,`tag_id`),
  KEY `character_tag_ibfk_2` (`tag_id`),
  CONSTRAINT `character_tag_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `Characters` (`character_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `character_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Characters
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Characters`;

CREATE TABLE `Characters` (
  `character_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `character_name` varchar(100) NOT NULL DEFAULT '',
  `hair_color` varchar(100) DEFAULT NULL,
  `love_rank` int(10) unsigned DEFAULT NULL,
  `hate_rank` int(10) unsigned DEFAULT NULL,
  `love_user_count` int(10) unsigned DEFAULT NULL,
  `hate_user_count` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`character_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Genres
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Genres`;

CREATE TABLE `Genres` (
  `genre_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`genre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Licensors
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Licensors`;

CREATE TABLE `Licensors` (
  `licensor_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `licensor_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`licensor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Producers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Producers`;

CREATE TABLE `Producers` (
  `producer_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `producer_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`producer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Reviews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Reviews`;

CREATE TABLE `Reviews` (
  `review_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(200) DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `review_time` date DEFAULT NULL,
  `ranking_story` float DEFAULT NULL,
  `ranking_animation` float DEFAULT NULL,
  `ranking_sound` float DEFAULT NULL,
  `ranking_character` float DEFAULT NULL,
  `ranking_overall` float DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `anime_reviews_ibfk_2` (`user_id`),
  CONSTRAINT `anime_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Studios
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Studios`;

CREATE TABLE `Studios` (
  `studio_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `studio_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`studio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Tags`;

CREATE TABLE `Tags` (
  `tag_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Users`;

CREATE TABLE `Users` (
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(200) NOT NULL DEFAULT '',
  `location` varchar(200) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `followers` int(11) unsigned DEFAULT NULL,
  `following` int(11) unsigned DEFAULT NULL,
  `watched_animes` int(11) unsigned DEFAULT NULL,
  `watching_animes` int(11) unsigned DEFAULT NULL,
  `want_to_watch_animes` int(11) unsigned DEFAULT NULL,
  `stalled_animes` int(11) unsigned DEFAULT NULL,
  `dropped_animes` int(11) unsigned DEFAULT NULL,
  `total_anime_episodes` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
