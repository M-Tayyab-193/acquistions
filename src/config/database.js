import 'dotenv/config.js';

import { neon } from '@neondatabase/serverless';

import { drizzle } from 'dirzzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

export { db, sql };
