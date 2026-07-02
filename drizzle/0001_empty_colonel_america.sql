ALTER TABLE `chapter_progress` DROP INDEX `user_chapter_idx`;--> statement-breakpoint
ALTER TABLE `daily_quiz_records` DROP INDEX `dqr_user_date`;--> statement-breakpoint
ALTER TABLE `leaderboard_snapshots` DROP INDEX `ls_user_date`;--> statement-breakpoint
ALTER TABLE `learning_time_logs` DROP INDEX `ltl_user_date_chapter`;--> statement-breakpoint
ALTER TABLE `user_badges` DROP INDEX `ub_unique`;--> statement-breakpoint
ALTER TABLE `wrong_notes` DROP INDEX `wn_unique_q`;--> statement-breakpoint
DROP INDEX `user_idx` ON `chapter_progress`;--> statement-breakpoint
DROP INDEX `dqr_user_idx` ON `daily_quiz_records`;--> statement-breakpoint
DROP INDEX `ltl_user_idx` ON `learning_time_logs`;--> statement-breakpoint
DROP INDEX `qa_user_idx` ON `quiz_attempts`;--> statement-breakpoint
DROP INDEX `ub_user_idx` ON `user_badges`;--> statement-breakpoint
DROP INDEX `wn_user_idx` ON `wrong_notes`;--> statement-breakpoint
DROP INDEX `xp_user_idx` ON `xp_transactions`;--> statement-breakpoint
ALTER TABLE `chapter_progress` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `daily_quiz_records` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `leaderboard_snapshots` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `learning_time_logs` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `quiz_attempts` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `user_badges` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `wrong_notes` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `xp_transactions` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `chapter_progress` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `daily_quiz_records` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `leaderboard_snapshots` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `leaderboard_snapshots` ADD `displayName` varchar(100);--> statement-breakpoint
ALTER TABLE `learning_time_logs` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `quiz_attempts` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `user_badges` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `wrong_notes` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `xp_transactions` ADD `deviceId` varchar(128);--> statement-breakpoint
ALTER TABLE `chapter_progress` ADD CONSTRAINT `user_chapter_idx` UNIQUE(`deviceId`,`chapterId`);--> statement-breakpoint
ALTER TABLE `daily_quiz_records` ADD CONSTRAINT `dqr_user_date` UNIQUE(`deviceId`,`quizDate`);--> statement-breakpoint
ALTER TABLE `leaderboard_snapshots` ADD CONSTRAINT `ls_user_date` UNIQUE(`deviceId`,`snapshotDate`);--> statement-breakpoint
ALTER TABLE `learning_time_logs` ADD CONSTRAINT `ltl_user_date_chapter` UNIQUE(`deviceId`,`logDate`,`chapterId`);--> statement-breakpoint
ALTER TABLE `user_badges` ADD CONSTRAINT `ub_unique` UNIQUE(`deviceId`,`badgeKey`);--> statement-breakpoint
ALTER TABLE `wrong_notes` ADD CONSTRAINT `wn_unique_q` UNIQUE(`deviceId`,`questionId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `chapter_progress` (`deviceId`);--> statement-breakpoint
CREATE INDEX `dqr_user_idx` ON `daily_quiz_records` (`deviceId`);--> statement-breakpoint
CREATE INDEX `ltl_user_idx` ON `learning_time_logs` (`deviceId`);--> statement-breakpoint
CREATE INDEX `qa_user_idx` ON `quiz_attempts` (`deviceId`);--> statement-breakpoint
CREATE INDEX `ub_user_idx` ON `user_badges` (`deviceId`);--> statement-breakpoint
CREATE INDEX `wn_user_idx` ON `wrong_notes` (`deviceId`);--> statement-breakpoint
CREATE INDEX `xp_user_idx` ON `xp_transactions` (`deviceId`);