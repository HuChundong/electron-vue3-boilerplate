CREATE TABLE `account` (
	`id` integer PRIMARY KEY DEFAULT 0 NOT NULL,
	`mobile` text DEFAULT '' NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`small_head_url` text DEFAULT '' NOT NULL,
	`wxid` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` integer PRIMARY KEY DEFAULT 0 NOT NULL,
	`title` text DEFAULT '' NOT NULL
);
