import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import { hubDatabase } from '@nuxthub/core/dist/runtime/database/server/utils/database';
import * as schema from '../database/schema';

export { sql, eq, and, or } from 'drizzle-orm';

export type TDbTables = typeof schema;

export const tables: TDbTables = schema;

export function useDrizzle(): DrizzleD1Database<typeof schema> {
  return drizzle(hubDatabase(), { schema });
}
