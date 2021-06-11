-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: eu-cdbr-west-03.cleardb.net
-- Generation Time: Jun 11, 2021 at 09:56 PM
-- Server version: 5.6.50-log
-- PHP Version: 7.3.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heroku_6381d6ff4b958f9`
--

-- --------------------------------------------------------

--
-- Table structure for table `lobbies`
--

CREATE TABLE `lobbies` (
  `id` int(20) NOT NULL,
  `invite_code` varchar(40) DEFAULT NULL,
  `guild` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `started` tinyint(1) NOT NULL DEFAULT '0',
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `participations`
--

CREATE TABLE `participations` (
  `id` int(11) NOT NULL,
  `lobby_id` int(20) NOT NULL,
  `user_id` varchar(25) NOT NULL,
  `leader` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `participations_roles`
--

CREATE TABLE `participations_roles` (
  `participation_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=armscii8;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `emote` varchar(255) NOT NULL,
  `position` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(25) NOT NULL,
  `wins` int(11) NOT NULL DEFAULT '0',
  `losses` int(11) NOT NULL DEFAULT '0',
  `deaths` int(11) NOT NULL DEFAULT '0',
  `as_werewolf` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lobbies`
--
ALTER TABLE `lobbies`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `INVITE_CODE` (`invite_code`);

--
-- Indexes for table `participations`
--
ALTER TABLE `participations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MATCH_ID` (`lobby_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `participations_roles`
--
ALTER TABLE `participations_roles`
  ADD KEY `participation_id` (`participation_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD UNIQUE KEY `UNIQUE` (`id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lobbies`
--
ALTER TABLE `lobbies`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participations`
--
ALTER TABLE `participations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `participations`
--
ALTER TABLE `participations`
  ADD CONSTRAINT `participations_ibfk_1` FOREIGN KEY (`lobby_id`) REFERENCES `lobbies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `participations_roles`
--
ALTER TABLE `participations_roles`
  ADD CONSTRAINT `participations_roles_ibfk_1` FOREIGN KEY (`participation_id`) REFERENCES `participations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participations_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
