ALTER TABLE `nfrs` ADD `nfrUser` text(20) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `nfrs` ADD `attrUser` text(20) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `nfrs` DROP COLUMN `user`;