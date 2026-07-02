CREATE TABLE `milestone_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`deviceId` varchar(128) NOT NULL,
	`milestoneId` varchar(50) NOT NULL,
	`weekNumber` int NOT NULL,
	`isChecked` boolean NOT NULL DEFAULT false,
	`checkedAt` timestamp,
	`selfRating` int,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milestone_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `mp_device_milestone` UNIQUE(`deviceId`,`milestoneId`)
);
--> statement-breakpoint
CREATE INDEX `mp_device_idx` ON `milestone_progress` (`deviceId`);