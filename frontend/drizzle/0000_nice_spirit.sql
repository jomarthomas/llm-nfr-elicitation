CREATE TABLE `frs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requirement` text(2000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nfrs` (
	`id` text PRIMARY KEY NOT NULL,
	`fr_id` integer NOT NULL,
	`attribute` text NOT NULL,
	`requirement` text(2000) NOT NULL,
	`justification` text(2000) NOT NULL,
	`applicability` integer DEFAULT 0 NOT NULL,
	`validity` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`fr_id`) REFERENCES `frs`(`id`) ON UPDATE no action ON DELETE cascade
);
