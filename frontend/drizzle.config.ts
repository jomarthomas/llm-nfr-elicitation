import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = true// process.env.NODE_ENV === 'production';
const dbCredentials = isProduction
	? {
			url: process.env.PROD_TURSO_DATABASE_URL!,
			authToken: process.env.PROD_TURSO_AUTH_TOKEN!
		}
	: {
			url: 'file:./.dev.db',
			token: ''
		};

export default defineConfig({
	dialect: isProduction ? 'turso' : 'sqlite',
	schema: './src/db/schema.ts',
	dbCredentials
});
