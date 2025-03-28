import {
  defineStore,
} from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { TDbUser } from '~/server/database/schema';
import type { IApiValidationDetailedResponse } from '~/server/api/server.api.types';
import type { IApiAuthSignUpPostRequest } from '~/server/api/auth/server.api.auth.types';

export enum AuthUserStateStoreEnum {
  Loading = 'loading',
  LoggedIn = 'loggedIn',
  LoggedOut = 'loggedOut',
}

const userKey: string = 'nht-user';

export const useAuthStore = defineStore('auth', () => {
  const user: ComputedRef<TDbUser | null>
    = computed(() => {
      const lsUser: string | null = localStorage.getItem(userKey);

      return lsUser
        ? { ...JSON.parse(lsUser), createdAt: new Date(JSON.parse(lsUser).createdAt) } as TDbUser
        : null;
    });

  const userState: Ref<AuthUserStateStoreEnum> = ref(
    user.value ? AuthUserStateStoreEnum.LoggedIn : AuthUserStateStoreEnum.LoggedOut,
  );

  async function signUp(userData: IApiAuthSignUpPostRequest): Promise<TDbUser | IApiValidationDetailedResponse<keyof TDbUser> | unknown> {
    userState.value = AuthUserStateStoreEnum.Loading;

    try {
      const createdUser = await $fetch('/api/auth/sign-up', {
        method: 'POST',
        body: userData,
      });

      localStorage.setItem(userKey, JSON.stringify(createdUser));

      userState.value = AuthUserStateStoreEnum.LoggedIn;

      return createdUser;
    } catch (err) {
      userState.value = AuthUserStateStoreEnum.LoggedOut;

      throw err;
    }
  }

  // intermediary class to enable advanced type checks on TSC level, eg.
  // - preventing calling `logOut` without first checking if `isLoggedIn` is true
  // - typing `user` getter to be a full user model if `isLoggedIn` is true
  // - allowing to only call `signUp` if `isLoggedOut` is true
  class AuthStore<TUserState extends AuthUserStateStoreEnum> {
    public get user(): TUserState extends AuthUserStateStoreEnum.LoggedIn ? ComputedRef<TDbUser> : ComputedRef<null> {
      return user as TUserState extends AuthUserStateStoreEnum.LoggedIn ? ComputedRef<TDbUser> : ComputedRef<null>;
    }

    public isLoggedIn(): this is AuthStore<AuthUserStateStoreEnum.LoggedIn> {
      return userState.value === AuthUserStateStoreEnum.LoggedIn;
    }

    public isLoggedOut(): this is AuthStore<AuthUserStateStoreEnum.LoggedOut> {
      return userState.value === AuthUserStateStoreEnum.LoggedOut;
    }

    public logOut(this: AuthStore<AuthUserStateStoreEnum.LoggedIn>): this is AuthStore<AuthUserStateStoreEnum.LoggedOut> {
      localStorage.removeItem(userKey);

      userState.value = AuthUserStateStoreEnum.LoggedOut;

      return true;
    }

    public signUp(
      this: AuthStore<AuthUserStateStoreEnum.LoggedOut>,
      userData: IApiAuthSignUpPostRequest,
    ): Promise<TDbUser | IApiValidationDetailedResponse<keyof TDbUser> | unknown> {
      return signUp(userData);
    }
  }

  const authStore: AuthStore<AuthUserStateStoreEnum> = new AuthStore();

  return { proxy: authStore, userState };
});
