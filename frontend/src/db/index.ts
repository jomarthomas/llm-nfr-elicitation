import * as schema from './schema';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import {
	PROD_TURSO_AUTH_TOKEN,
	PROD_TURSO_DATABASE_URL,
	TURSO_AUTH_TOKEN,
	TURSO_DATABASE_URL
} from '$env/static/private';

const isProduction = process.env.NODE_ENV === 'production';

const turso = createClient({
	url: isProduction ? PROD_TURSO_DATABASE_URL : TURSO_DATABASE_URL,
	authToken: isProduction ? PROD_TURSO_AUTH_TOKEN : TURSO_AUTH_TOKEN
});

export const db = drizzle(turso, { schema });
