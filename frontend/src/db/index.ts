import * as schema from './schema';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
// import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';

const turso = createClient({
	url: "file:./.dev.db",
	authToken: "TURSO_AUTH_TOKEN"
});

export const db = drizzle(turso, { schema });
