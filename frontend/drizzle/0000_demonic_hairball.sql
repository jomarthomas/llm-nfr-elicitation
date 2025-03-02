CREATE TABLE `frs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requirement` text(2000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nfrs` (
	`id` text PRIMARY KEY NOT NULL,
	`fr_id` integer NOT NULL,
	`attribute` text NOT NULL,
	`llm` text NOT NULL,
	`requirement` text(2000) NOT NULL,
	`justification` text(2000) NOT NULL,
	`applicability` integer DEFAULT 0 NOT NULL,
	`validity` integer DEFAULT 0 NOT NULL,
	`nfrUser` text(20) DEFAULT '' NOT NULL,
	`humanAttr` text DEFAULT '' NOT NULL,
	`attrUser` text(20) DEFAULT '' NOT NULL,
	FOREIGN KEY (`fr_id`) REFERENCES `frs`(`id`) ON UPDATE no action ON DELETE cascade
);
