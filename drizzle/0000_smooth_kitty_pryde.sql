CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`content` text NOT NULL,
	`type` enum('info','warning','success','urgent') NOT NULL DEFAULT 'info',
	`isPinned` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`targetRole` enum('all','user','admin') NOT NULL DEFAULT 'all',
	`expiresAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `badge_definitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badgeKey` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`color` varchar(20),
	`xpReward` int NOT NULL DEFAULT 0,
	`triggerType` enum('chapter_count','quiz_score','streak_days','xp_total','daily_quiz_count','manual') NOT NULL,
	`triggerValue` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badge_definitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `badge_definitions_badgeKey_unique` UNIQUE(`badgeKey`)
);
--> statement-breakpoint
CREATE TABLE `chapter_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chapterId` varchar(20) NOT NULL,
	`chapterTitle` varchar(200),
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`readTimeSeconds` int NOT NULL DEFAULT 0,
	`quizPassed` boolean NOT NULL DEFAULT false,
	`quizScore` int,
	`quizAttempts` int NOT NULL DEFAULT 0,
	`lastQuizAt` timestamp,
	`isUnlocked` boolean NOT NULL DEFAULT false,
	`unlockedAt` timestamp,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chapter_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_chapter_idx` UNIQUE(`userId`,`chapterId`)
);
--> statement-breakpoint
CREATE TABLE `daily_quiz_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`quizDate` varchar(10) NOT NULL,
	`questionId` varchar(50) NOT NULL,
	`questionText` text,
	`selectedAnswer` int,
	`correctAnswer` int NOT NULL,
	`isCorrect` boolean,
	`isAnswered` boolean NOT NULL DEFAULT false,
	`answeredAt` timestamp,
	`xpEarned` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_quiz_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `dqr_user_date` UNIQUE(`userId`,`quizDate`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`snapshotDate` varchar(10) NOT NULL,
	`totalXp` int NOT NULL DEFAULT 0,
	`chaptersCompleted` int NOT NULL DEFAULT 0,
	`averageQuizScore` float NOT NULL DEFAULT 0,
	`totalLearningSeconds` int NOT NULL DEFAULT 0,
	`currentStreak` int NOT NULL DEFAULT 0,
	`compositeScore` float NOT NULL DEFAULT 0,
	`rank` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leaderboard_snapshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `ls_user_date` UNIQUE(`userId`,`snapshotDate`)
);
--> statement-breakpoint
CREATE TABLE `learning_time_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`logDate` varchar(10) NOT NULL,
	`chapterId` varchar(20),
	`totalSeconds` int NOT NULL DEFAULT 0,
	`sessionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_time_logs_id` PRIMARY KEY(`id`),
	CONSTRAINT `ltl_user_date_chapter` UNIQUE(`userId`,`logDate`,`chapterId`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chapterId` varchar(20) NOT NULL,
	`attemptNumber` int NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`correctAnswers` int NOT NULL,
	`passed` boolean NOT NULL,
	`timeTakenSeconds` int,
	`answers` json,
	`xpEarned` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeKey` varchar(50) NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`xpAwarded` int NOT NULL DEFAULT 0,
	`isNew` boolean NOT NULL DEFAULT true,
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `ub_unique` UNIQUE(`userId`,`badgeKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`displayName` varchar(100),
	`department` varchar(100),
	`avatarUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`totalXp` int NOT NULL DEFAULT 0,
	`currentLevel` int NOT NULL DEFAULT 1,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastActiveDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `wrong_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chapterId` varchar(20) NOT NULL,
	`questionId` varchar(50) NOT NULL,
	`questionText` text NOT NULL,
	`options` json NOT NULL,
	`correctAnswer` int NOT NULL,
	`explanation` text,
	`userAnswer` int,
	`isMastered` boolean NOT NULL DEFAULT false,
	`masteredAt` timestamp,
	`reviewCount` int NOT NULL DEFAULT 0,
	`lastReviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wrong_notes_id` PRIMARY KEY(`id`),
	CONSTRAINT `wn_unique_q` UNIQUE(`userId`,`questionId`)
);
--> statement-breakpoint
CREATE TABLE `xp_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`reason` enum('chapter_read','quiz_pass','quiz_perfect','daily_quiz','daily_login','streak_7','streak_30','streak_100','all_chapters','first_login','admin_adjust') NOT NULL,
	`description` text,
	`referenceId` varchar(50),
	`balanceAfter` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `xp_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `chapter_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `dqr_user_idx` ON `daily_quiz_records` (`userId`);--> statement-breakpoint
CREATE INDEX `dqr_date_idx` ON `daily_quiz_records` (`quizDate`);--> statement-breakpoint
CREATE INDEX `ls_date_idx` ON `leaderboard_snapshots` (`snapshotDate`);--> statement-breakpoint
CREATE INDEX `ltl_user_idx` ON `learning_time_logs` (`userId`);--> statement-breakpoint
CREATE INDEX `qa_user_idx` ON `quiz_attempts` (`userId`);--> statement-breakpoint
CREATE INDEX `qa_chapter_idx` ON `quiz_attempts` (`chapterId`);--> statement-breakpoint
CREATE INDEX `ub_user_idx` ON `user_badges` (`userId`);--> statement-breakpoint
CREATE INDEX `wn_user_idx` ON `wrong_notes` (`userId`);--> statement-breakpoint
CREATE INDEX `xp_user_idx` ON `xp_transactions` (`userId`);--> statement-breakpoint
CREATE INDEX `xp_created_idx` ON `xp_transactions` (`createdAt`);