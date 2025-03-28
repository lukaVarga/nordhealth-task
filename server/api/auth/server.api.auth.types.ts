import type { TDbUserInsert } from '~/server/database/schema';

export interface IApiAuthCheckEmailGetRequest {
  email: string;
}

export interface IApiAuthSignUpPostRequest extends Omit<TDbUserInsert, 'createdAt' | 'id'> {}
