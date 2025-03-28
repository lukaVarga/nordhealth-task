import type { H3Event } from 'h3';
import * as bcrypt from 'bcryptjs';
import { getTableColumns } from 'drizzle-orm';
import { tables, useDrizzle } from '~/server/utils/drizzle';
import type { TDbUser, TDbUserInsert } from '~/server/database/schema';
import type { IApiAuthSignUpPostRequest } from '~/server/api/auth/server.api.auth.types';
import type {
  IApiValidationDetailedResponse,
  IApiValidationFieldErrorResponse,
  IApiValidationSimpleErrorResponse,
} from '~/server/api/server.api.types';

function payloadIsValid(payload: Partial<TDbUserInsert>): payload is TDbUserInsert {
  let validationErrors: Array<IApiValidationFieldErrorResponse<keyof IApiAuthSignUpPostRequest>> = [];

  if (!payload.email) {
    validationErrors = [{ field: 'email', message: 'Email is required' }];
  }

  if (!payload.password) {
    validationErrors = validationErrors.concat([{ field: 'password', message: 'Password is required' }]);
  }

  if (validationErrors.length) {
    const errorResp: IApiValidationDetailedResponse<keyof IApiAuthSignUpPostRequest> = {
      validationErrors,
      statusCode: 422,
    };

    throw createError(errorResp);
  }

  return true;
}

// for a real world app, the server EPs should have unit tests as well,
// but for the sake of this task - considering it's for a FE role anyway - I opted to skip them
export default defineEventHandler(async (event: H3Event): Promise<TDbUser> => {
  const payload: Partial<IApiAuthSignUpPostRequest> = await readBody(event);

  const errorResp: IApiValidationSimpleErrorResponse = {
    statusMessage: 'Failed to create user',
    statusCode: 500,
  };

  // just to simulate some latency
  await new Promise(resolve => setTimeout(resolve, Math.random() * 5_000));

  if (payloadIsValid(payload)) {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password, ...otherProps } = getTableColumns(tables.users);

    const userPayload: TDbUserInsert = {
      email: payload.email,
      password: bcrypt.hashSync(payload.password, 10),
      announcements: payload.announcements,
      createdAt: new Date(),
    };

    const user: TDbUser | undefined = await useDrizzle()
      .insert(tables.users)
      .values(userPayload)
      .returning(otherProps)
      .get();

    if (!user) {
      throw createError(errorResp);
    }

    return user;
  }

  throw createError(errorResp);
});
