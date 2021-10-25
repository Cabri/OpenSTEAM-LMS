-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mariadb
-- Généré le : mer. 15 sep. 2021 à 08:11
-- Version du serveur : 10.6.3-MariaDB-1:10.6.3+maria~focal
-- Version de PHP : 7.4.20

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `steam-lms-db-empty`
--

-- --------------------------------------------------------

--
-- Structure de la table `classrooms`
--

CREATE TABLE `classrooms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `school` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `groupe` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `link` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `is_changed` tinyint(1) DEFAULT NULL,
  `is_blocked` int(11) NOT NULL DEFAULT 0,
  `uai` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `classroom_activities_link_classroom`
--

CREATE TABLE `classroom_activities_link_classroom` (
  `id` int(11) NOT NULL,
  `id_classroom` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  `id_course` int(11) DEFAULT NULL,
  `date_begin` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `coefficient` int(11) DEFAULT NULL,
  `commentary` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `introduction` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_autocorrected` tinyint(1) NOT NULL DEFAULT 0,
  `is_evaluation` tinyint(1) NOT NULL DEFAULT 0,
  `reference` varchar(13) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `classroom_activities_link_classroom_users`
--

CREATE TABLE `classroom_activities_link_classroom_users` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  `reference` varchar(13) COLLATE utf8_unicode_ci NOT NULL DEFAULT '123456789',
  `project` int(11) DEFAULT NULL,
  `id_course` int(11) DEFAULT NULL,
  `correction` int(11) DEFAULT NULL,
  `date_begin` datetime DEFAULT NULL,
  `date_end` datetime DEFAULT NULL,
  `date_send` datetime DEFAULT NULL,
  `time_passed` int(11) DEFAULT NULL,
  `tries` int(11) DEFAULT NULL,
  `coefficient` int(11) DEFAULT NULL,
  `note` tinyint(1) DEFAULT NULL,
  `commentary` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `introduction` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_autocorrected` tinyint(1) NOT NULL DEFAULT 0,
  `is_evaluation` tinyint(1) NOT NULL DEFAULT 0,
  `url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `classroom_users_link_classrooms`
--

CREATE TABLE `classroom_users_link_classrooms` (
  `id_user` int(11) NOT NULL,
  `id_classroom` int(11) NOT NULL,
  `rights` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `connection_tokens`
--

CREATE TABLE `connection_tokens` (
  `id` int(11) NOT NULL,
  `user_ref` int(11) DEFAULT NULL,
  `token` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `last_time_active` timestamp NULL DEFAULT current_timestamp(),
  `date_inserted` timestamp NULL DEFAULT current_timestamp(),
  `is_expired` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `interfaces_projects`
--

CREATE TABLE `interfaces_projects` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `project_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Unamed',
  `interface` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `project_description` varchar(1000) COLLATE utf8_unicode_ci DEFAULT 'No description',
  `date_updated` timestamp NULL DEFAULT current_timestamp(),
  `code` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `code_mixed` mediumtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `code_language` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `manually_modified` tinyint(1) NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `mode` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `is_activity_solve` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `interfaces_projects_link_users`
--

CREATE TABLE `interfaces_projects_link_users` (
  `user` int(11) NOT NULL,
  `project` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_activities`
--

CREATE TABLE `learn_activities` (
  `id` int(11) NOT NULL,
  `id_fork` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `is_from_classroom` tinyint(1) NOT NULL DEFAULT 0,
  `title` varchar(1000) COLLATE utf8_unicode_ci DEFAULT 'No title',
  `content` varchar(10000) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'No content',
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_chapters`
--

CREATE TABLE `learn_chapters` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `grade` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_chapters_link_tutorials`
--

CREATE TABLE `learn_chapters_link_tutorials` (
  `chapter_id` int(11) NOT NULL,
  `tutorial_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_collections`
--

CREATE TABLE `learn_collections` (
  `id` int(11) NOT NULL,
  `name_collection` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Unamed',
  `grade_collection` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Unamed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_comments`
--

CREATE TABLE `learn_comments` (
  `id` int(11) NOT NULL,
  `tutorial_id` int(11) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `comment_answered` int(11) DEFAULT NULL,
  `message` longtext COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_courses`
--

CREATE TABLE `learn_courses` (
  `id` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `id_fork` int(11) DEFAULT NULL,
  `title` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'No title',
  `description` varchar(1000) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'No description',
  `duration` int(11) NOT NULL DEFAULT 3600,
  `difficulty` int(11) NOT NULL DEFAULT 0,
  `lang` varchar(100) COLLATE utf8_unicode_ci DEFAULT 'No lang',
  `support` int(11) NOT NULL,
  `img` varchar(10000) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'No image',
  `link` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'No link',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `rights` int(11) NOT NULL DEFAULT 0,
  `views` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_courses_link_activities`
--

CREATE TABLE `learn_courses_link_activities` (
  `id_course` int(11) NOT NULL,
  `id_activity` int(11) NOT NULL,
  `index_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_favorites`
--

CREATE TABLE `learn_favorites` (
  `user_id` int(11) NOT NULL,
  `tutorial_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `learn_tutorials_link_tutorials`
--

CREATE TABLE `learn_tutorials_link_tutorials` (
  `tutorial1_id` int(11) NOT NULL,
  `tutorial2_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `pseudo` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `surname` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `insert_date` timestamp NULL DEFAULT current_timestamp(),
  `update_date` timestamp NULL DEFAULT current_timestamp(),
  `picture` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_classroom_users`
--

CREATE TABLE `user_classroom_users` (
  `user` int(11) NOT NULL,
  `gar_id` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `school_id` varchar(8) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_teacher` tinyint(1) DEFAULT NULL,
  `mail_teacher` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_premium`
--

CREATE TABLE `user_premium` (
  `id_user` int(11) NOT NULL,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_regulars`
--

CREATE TABLE `user_regulars` (
  `id` int(11) NOT NULL,
  `bio` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `telephone` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `confirm_token` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact_flag` tinyint(1) NOT NULL DEFAULT 1,
  `newsletter` tinyint(1) NOT NULL DEFAULT 1,
  `mail_messages` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `recovery_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `new_mail` varchar(1000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `private_flag` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_teachers`
--

CREATE TABLE `user_teachers` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `subject` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `school` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `applications`
--

CREATE TABLE `classroom_applications` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `classroom_groups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(5) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `groups_link_applications`
--

CREATE TABLE `classroom_groups_link_applications` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `date_begin` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `max_students_per_groups` int(11) DEFAULT NULL,
  `max_teachers_per_groups` int(11) DEFAULT NULL,
  `max_students_per_teachers` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users_link_applications`
--

CREATE TABLE `classroom_users_link_applications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `date_begin` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `max_students_per_teachers` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users_link_applications_from_groups`
--

CREATE TABLE `classroom_users_link_applications_from_groups` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users_link_groups`
--

CREATE TABLE `classroom_users_link_groups` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `rights` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Structure de la table `classroom_restrictions`
--

CREATE TABLE `classroom_restrictions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `restrictions` longtext CHARACTER SET utf8 COLLATE=utf8_unicode_ci DEFAULT NULL CHECK (json_valid(`restrictions`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `classroom_restrictions`
--

INSERT INTO `classroom_restrictions` (`id`, `name`, `restrictions`) VALUES
(1, 'userDefaultRestrictions', '\"{\\\"maxStudents\\\":50}\"'),
(2, 'groupDefaultRestrictions', '\"{\\\"maxStudents\\\":1000,\\\"maxTeachers\\\":20,\\\"maxStudentsPerTeacher\\\":50}\"'),
(3, 'activitiesDefaultRestrictions', '\"{\\\"Genius\\\":10,\\\"Express\\\":10}\"');


--
-- Index pour les tables déchargées
--

--
-- Index pour la table `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `classroom_activities_link_classroom`
--
ALTER TABLE `classroom_activities_link_classroom`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_55890A29C9488CBA` (`id_classroom`),
  ADD KEY `IDX_55890A29FCAFE5CF` (`id_activity`),
  ADD KEY `IDX_55890A2930A9DA54` (`id_course`);

--
-- Index pour la table `classroom_activities_link_classroom_users`
--
ALTER TABLE `classroom_activities_link_classroom_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_E8E10C06B3CA4B` (`id_user`),
  ADD KEY `IDX_E8E10C0FCAFE5CF` (`id_activity`),
  ADD KEY `IDX_E8E10C02FB3D0EE` (`project`),
  ADD KEY `IDX_E8E10C030A9DA54` (`id_course`);

--
-- Index pour la table `classroom_users_link_classrooms`
--
ALTER TABLE `classroom_users_link_classrooms`
  ADD PRIMARY KEY (`id_user`,`id_classroom`),
  ADD KEY `IDX_D2CA61A6B3CA4B` (`id_user`),
  ADD KEY `IDX_D2CA61AC9488CBA` (`id_classroom`);

--
-- Index pour la table `connection_tokens`
--
ALTER TABLE `connection_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_99FD688EFF795F28` (`user_ref`);

--
-- Index pour la table `interfaces_projects`
--
ALTER TABLE `interfaces_projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_3B4E597036AC99F1` (`link`),
  ADD KEY `IDX_3B4E59708D93D649` (`user`);

--
-- Index pour la table `interfaces_projects_link_users`
--
ALTER TABLE `interfaces_projects_link_users`
  ADD PRIMARY KEY (`user`,`project`),
  ADD KEY `IDX_ADA761808D93D649` (`user`),
  ADD KEY `IDX_ADA761802FB3D0EE` (`project`);

--
-- Index pour la table `learn_activities`
--
ALTER TABLE `learn_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B445188530CB4478` (`id_fork`),
  ADD KEY `IDX_B44518856B3CA4B` (`id_user`);

--
-- Index pour la table `learn_chapters`
--
ALTER TABLE `learn_chapters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `collection_name_unique` (`collection_id`,`name`),
  ADD KEY `IDX_B130E3A7514956FD` (`collection_id`);

--
-- Index pour la table `learn_chapters_link_tutorials`
--
ALTER TABLE `learn_chapters_link_tutorials`
  ADD PRIMARY KEY (`chapter_id`,`tutorial_id`),
  ADD UNIQUE KEY `chapter_tutorial_unique` (`chapter_id`,`tutorial_id`),
  ADD KEY `IDX_3AAC0F58579F4768` (`chapter_id`),
  ADD KEY `IDX_3AAC0F5889366B7B` (`tutorial_id`);

--
-- Index pour la table `learn_collections`
--
ALTER TABLE `learn_collections`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `learn_comments`
--
ALTER TABLE `learn_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_298F36FC89366B7B` (`tutorial_id`),
  ADD KEY `IDX_298F36FC8D93D649` (`user`),
  ADD KEY `IDX_298F36FC7032E9EE` (`comment_answered`);

--
-- Index pour la table `learn_courses`
--
ALTER TABLE `learn_courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_64441C0C8D93D649` (`user`),
  ADD KEY `IDX_64441C0C30CB4478` (`id_fork`);

--
-- Index pour la table `learn_courses_link_activities`
--
ALTER TABLE `learn_courses_link_activities`
  ADD PRIMARY KEY (`id_course`,`id_activity`),
  ADD KEY `IDX_AF4AA5BD30A9DA54` (`id_course`),
  ADD KEY `IDX_AF4AA5BDFCAFE5CF` (`id_activity`);

--
-- Index pour la table `learn_favorites`
--
ALTER TABLE `learn_favorites`
  ADD PRIMARY KEY (`user_id`,`tutorial_id`),
  ADD UNIQUE KEY `user_tutorial_unique` (`user_id`,`tutorial_id`),
  ADD KEY `IDX_8BAF06B4A76ED395` (`user_id`),
  ADD KEY `IDX_8BAF06B489366B7B` (`tutorial_id`);

--
-- Index pour la table `learn_tutorials_link_tutorials`
--
ALTER TABLE `learn_tutorials_link_tutorials`
  ADD PRIMARY KEY (`tutorial1_id`,`tutorial2_id`),
  ADD UNIQUE KEY `couple_tutorial_unique` (`tutorial1_id`,`tutorial2_id`),
  ADD KEY `IDX_B7C981A1132B34C` (`tutorial1_id`),
  ADD KEY `IDX_B7C981A3871CA2` (`tutorial2_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user_classroom_users`
--
ALTER TABLE `user_classroom_users`
  ADD PRIMARY KEY (`user`);

--
-- Index pour la table `user_premium`
--
ALTER TABLE `user_premium`
  ADD PRIMARY KEY (`id_user`);

--
-- Index pour la table `user_regulars`
--
ALTER TABLE `user_regulars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_7A774CC5E7927C74` (`email`);

--
-- Index pour la table `user_teachers`
--
ALTER TABLE `user_teachers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D8AFBF6AC2FB178` (`user`);

--
-- Index pour la table `classroom_applications`
--
ALTER TABLE `classroom_applications`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `classroom_groups`
--
ALTER TABLE `classroom_groups`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `classroom_groups_link_applications`
--
ALTER TABLE `classroom_groups_link_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `application_id` (`application_id`);

--
-- Index pour la table `classroom_users_link_applications`
--
ALTER TABLE `classroom_users_link_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `application_id` (`application_id`);

--
-- Index pour la table `classroom_users_link_applications_from_groups`
--
ALTER TABLE `classroom_users_link_applications_from_groups`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `classroom_users_link_groups`
--
ALTER TABLE `classroom_users_link_groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Index pour la table `classroom_restrictions`
--
ALTER TABLE `classroom_restrictions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_activities_link_classroom`
--
ALTER TABLE `classroom_activities_link_classroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_activities_link_classroom_users`
--
ALTER TABLE `classroom_activities_link_classroom_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `connection_tokens`
--
ALTER TABLE `connection_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `interfaces_projects`
--
ALTER TABLE `interfaces_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learn_activities`
--
ALTER TABLE `learn_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learn_chapters`
--
ALTER TABLE `learn_chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learn_collections`
--
ALTER TABLE `learn_collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learn_comments`
--
ALTER TABLE `learn_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `learn_courses`
--
ALTER TABLE `learn_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_teachers`
--
ALTER TABLE `user_teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_applications`
--
ALTER TABLE `classroom_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_groups`
--
ALTER TABLE `classroom_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_groups_link_applications`
--
ALTER TABLE `classroom_groups_link_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_users_link_applications`
--
ALTER TABLE `classroom_users_link_applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_users_link_applications_from_groups`
--
ALTER TABLE `classroom_users_link_applications_from_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `classroom_users_link_groups`
--
ALTER TABLE `classroom_users_link_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

--
-- AUTO_INCREMENT pour la table `classroom_restrictions`
--
ALTER TABLE `classroom_restrictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `classroom_activities_link_classroom`
--
ALTER TABLE `classroom_activities_link_classroom`
  ADD CONSTRAINT `FK_55890A2930A9DA54` FOREIGN KEY (`id_course`) REFERENCES `learn_courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_55890A29C9488CBA` FOREIGN KEY (`id_classroom`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_55890A29FCAFE5CF` FOREIGN KEY (`id_activity`) REFERENCES `learn_activities` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `classroom_activities_link_classroom_users`
--
ALTER TABLE `classroom_activities_link_classroom_users`
  ADD CONSTRAINT `FK_E8E10C02FB3D0EE` FOREIGN KEY (`project`) REFERENCES `interfaces_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E8E10C030A9DA54` FOREIGN KEY (`id_course`) REFERENCES `learn_courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E8E10C06B3CA4B` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E8E10C0FCAFE5CF` FOREIGN KEY (`id_activity`) REFERENCES `learn_activities` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `classroom_users_link_classrooms`
--
ALTER TABLE `classroom_users_link_classrooms`
  ADD CONSTRAINT `FK_D2CA61A6B3CA4B` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_D2CA61AC9488CBA` FOREIGN KEY (`id_classroom`) REFERENCES `classrooms` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `connection_tokens`
--
ALTER TABLE `connection_tokens`
  ADD CONSTRAINT `FK_99FD688EFF795F28` FOREIGN KEY (`user_ref`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `interfaces_projects`
--
ALTER TABLE `interfaces_projects`
  ADD CONSTRAINT `FK_3B4E59708D93D649` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `interfaces_projects_link_users`
--
ALTER TABLE `interfaces_projects_link_users`
  ADD CONSTRAINT `FK_ADA761802FB3D0EE` FOREIGN KEY (`project`) REFERENCES `interfaces_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ADA761808D93D649` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `learn_activities`
--
ALTER TABLE `learn_activities`
  ADD CONSTRAINT `FK_B445188530CB4478` FOREIGN KEY (`id_fork`) REFERENCES `learn_activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_B44518856B3CA4B` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `learn_chapters`
--
ALTER TABLE `learn_chapters`
  ADD CONSTRAINT `FK_B130E3A7514956FD` FOREIGN KEY (`collection_id`) REFERENCES `learn_collections` (`id`);

--
-- Contraintes pour la table `learn_chapters_link_tutorials`
--
ALTER TABLE `learn_chapters_link_tutorials`
  ADD CONSTRAINT `FK_3AAC0F58579F4768` FOREIGN KEY (`chapter_id`) REFERENCES `learn_chapters` (`id`),
  ADD CONSTRAINT `FK_3AAC0F5889366B7B` FOREIGN KEY (`tutorial_id`) REFERENCES `learn_tutorials` (`id`);

--
-- Contraintes pour la table `learn_comments`
--
ALTER TABLE `learn_comments`
  ADD CONSTRAINT `FK_298F36FC7032E9EE` FOREIGN KEY (`comment_answered`) REFERENCES `learn_comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_298F36FC89366B7B` FOREIGN KEY (`tutorial_id`) REFERENCES `learn_tutorials` (`id`),
  ADD CONSTRAINT `FK_298F36FC8D93D649` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `learn_courses`
--
ALTER TABLE `learn_courses`
  ADD CONSTRAINT `FK_64441C0C30CB4478` FOREIGN KEY (`id_fork`) REFERENCES `learn_courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_64441C0C8D93D649` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `learn_courses_link_activities`
--
ALTER TABLE `learn_courses_link_activities`
  ADD CONSTRAINT `FK_AF4AA5BD30A9DA54` FOREIGN KEY (`id_course`) REFERENCES `learn_courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_AF4AA5BDFCAFE5CF` FOREIGN KEY (`id_activity`) REFERENCES `learn_activities` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `learn_favorites`
--
ALTER TABLE `learn_favorites`
  ADD CONSTRAINT `FK_8BAF06B489366B7B` FOREIGN KEY (`tutorial_id`) REFERENCES `learn_tutorials` (`id`),
  ADD CONSTRAINT `FK_8BAF06B4A76ED395` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `learn_tutorials_link_tutorials`
--
ALTER TABLE `learn_tutorials_link_tutorials`
  ADD CONSTRAINT `FK_B7C981A1132B34C` FOREIGN KEY (`tutorial1_id`) REFERENCES `learn_courses` (`id`),
  ADD CONSTRAINT `FK_B7C981A3871CA2` FOREIGN KEY (`tutorial2_id`) REFERENCES `learn_courses` (`id`);

--
-- Contraintes pour la table `user_classroom_users`
--
ALTER TABLE `user_classroom_users`
  ADD CONSTRAINT `FK_6AA056EF8D93D649` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_premium`
--
ALTER TABLE `user_premium`
  ADD CONSTRAINT `FK_454934486B3CA4C` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_regulars`
--
ALTER TABLE `user_regulars`
  ADD CONSTRAINT `FK_7A774CC5BF396750` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_teachers`
--
ALTER TABLE `user_teachers`
  ADD CONSTRAINT `FK_D8AFBF6AC2FB178` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
