import type { H3Event } from 'h3';
import { eq as drizzleEq } from 'drizzle-orm';
import { tables, useDrizzle } from '~/server/utils/drizzle';
import type { TDbUser } from '~/server/database/schema';
import type { IApiAuthCheckEmailGetRequest } from '~/server/api/auth/server.api.auth.types';
import type { IApiValidationSimpleErrorResponse } from '~/server/api/server.api.types';

// for a real world app, the server EPs should have unit tests as well,
// but for the sake of this task - considering it's for a FE role anyway - I opted to skip them
export default defineEventHandler(async (event: H3Event) => {
  const { email }: Partial<IApiAuthCheckEmailGetRequest> = getQuery(event);

  // just to simulate some latency
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1_000));

  if (!email) {
    const resp: IApiValidationSimpleErrorResponse = {
      statusMessage: 'Email is required',
      statusCode: 422,
    };

    throw createError(resp);
  }

  const [user]: TDbUser[] = await useDrizzle()
    .select()
    .from(tables.users)
    .where(drizzleEq(tables.users.email, email))
    .limit(1);

  if (user) {
    const resp: IApiValidationSimpleErrorResponse = {
      statusMessage: 'Email is already in use',
      statusCode: 422,
    };

    throw createError(resp);
  }

  return 'Ok';
});
