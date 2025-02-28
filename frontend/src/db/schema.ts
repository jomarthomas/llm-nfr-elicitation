import { sqliteTable, integer, text, foreignKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// FR Table
export const frTable = sqliteTable('frs', {
	id: integer('id').primaryKey({ autoIncrement: true }), // Auto-incrementing integer ID
	requirement: text('requirement', { length: 2000 }).notNull() // Long string for requirement
});

// NFR Table
export const nfrTable = sqliteTable('nfrs', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()), // Random UUID
	frId: integer('fr_id')
		.notNull()
		.references(() => frTable.id, { onDelete: 'cascade' }), // Foreign key to FR table
	attribute: text('attribute', {
		enum: [
			'Functional Suitability',
			'Performance Efficiency',
			'Compatibility',
			'Usability',
			'Reliability',
			'Security',
			'Maintainability',
			'Flexibility',
			'Safety'
		]
	}).notNull(), // Enum for attribute
	llm: text('llm', {
		enum: [
			'claude-3-5-haiku',
			'claude-3-7-sonnet',
			'deepSeek-V3',
			'gemini-1.5-pro',
			'gpt-4o-mini',
			'grok-2',
			'lama-3.3-70B',
			'Qwen2.5-72B'
		]
	}).notNull(),
	requirement: text('requirement', { length: 2000 }).notNull(), // Long string for requirement
	justification: text('justification', { length: 2000 }).notNull(), // Long string for justification
	applicability: integer('applicability').notNull().default(0), // 0-5, starts at 0
	validity: integer('validity').notNull().default(0), // 0-5, starts at 0,
	user: text('user', { length: 20 }).notNull().default('')
});

// TypeScript types for type safety
export type FRTable = typeof frTable.$inferSelect;
export type NFRTable = typeof nfrTable.$inferSelect;
