import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '~/stores/auth.store';
import type { TDbUser } from '~/server/database/schema';
import type { IApiAuthSignUpPostRequest } from '~/server/api/auth/server.api.auth.types';

describe('AuthStore', () => {
  let store: ReturnType<typeof useAuthStore>;
  let userMock: TDbUser;

  beforeEach(() => {
    userMock = {
      id: 142,
      email: 'john@doe.com',
      createdAt: new Date(),
      announcements: true,
    };

    setActivePinia(createPinia());
    store = useAuthStore();
  });

  describe('user is not present in localStorage', () => {
    it('initializes with logged out state', () => {
      expect(store.proxy.user).toBe(null);
      expect(store.userState).toBe(AuthUserStateStoreEnum.LoggedOut);
    });
  });

  describe('user is present in localStorage', () => {
    beforeEach(() => {
      localStorage.setItem('nht-user', JSON.stringify(userMock));

      setActivePinia(createPinia());
      store = useAuthStore();
    });

    it('initializes with logged in state', () => {
      expect(store.proxy.user).toEqual(userMock);
      expect(store.userState).toBe(AuthUserStateStoreEnum.LoggedIn);
    });
  });

  describe('isLoggedIn', () => {
    it('returns true if user state is logged in', () => {
      store.userState = AuthUserStateStoreEnum.LoggedIn;

      expect(store.proxy.isLoggedIn()).toBe(true);
    });

    it('returns false in other cases', () => {
      store.userState = AuthUserStateStoreEnum.LoggedOut;

      expect(store.proxy.isLoggedIn()).toBe(false);

      store.userState = AuthUserStateStoreEnum.Loading;

      expect(store.proxy.isLoggedIn()).toBe(false);
    });
  });

  describe('isLoggedOut', () => {
    it('returns true if user state is logged out', () => {
      store.userState = AuthUserStateStoreEnum.LoggedOut;

      expect(store.proxy.isLoggedOut()).toBe(true);
    });

    it('returns false in other cases', () => {
      store.userState = AuthUserStateStoreEnum.LoggedIn;

      expect(store.proxy.isLoggedOut()).toBe(false);

      store.userState = AuthUserStateStoreEnum.Loading;

      expect(store.proxy.isLoggedOut()).toBe(false);
    });
  });

  describe('logOut', () => {
    beforeEach(() => {
      localStorage.setItem('nht-user', JSON.stringify(userMock));

      setActivePinia(createPinia());
      store = useAuthStore();
    });

    it('logs out the user', () => {
      if (store.proxy.isLoggedIn()) {
        expect(store.proxy.user).toEqual(userMock);
        expect(store.userState).toBe(AuthUserStateStoreEnum.LoggedIn);

        store.proxy.logOut();

        expect(store.proxy.user).toBe(null);
        expect(store.userState).toBe(AuthUserStateStoreEnum.LoggedOut);
        expect(localStorage.getItem('nht-user')).toBe(null);
      } else {
        expect('user should be logged in').toBe('user is not logged in');
      }
    });
  });

  describe('signUp', () => {
    let signUpData: IApiAuthSignUpPostRequest;

    beforeEach(() => {
      signUpData = {
        email: 'john@doe.com',
        password: 'password123',
        announcements: true,
      };
    });

    it('signs up a new user', async () => {
      (vi.spyOn(global, '$fetch') as any).mockResolvedValue(userMock);

      if (store.proxy.isLoggedOut()) {
        const result = await store.proxy.signUp(signUpData);

        expect(result).toEqual(userMock);
        expect(store.userState).toBe(AuthUserStateStoreEnum.LoggedIn);
        expect(store.proxy.user).toEqual(userMock);
        expect(localStorage.getItem('nht-user')).toBe(JSON.stringify(userMock));
      } else {
        expect('user should be logged out').toBe('user is not logged out');
      }
    });

    it('handles sign up failure', async () => {
      if (store.proxy.isLoggedOut()) {
        const errorResponse = { error: 'Invalid data' };
        vi.spyOn(global, '$fetch').mockRejectedValue(errorResponse);

        let errorCaught: boolean = false;

        try {
          await store.proxy.signUp(signUpData);
        } catch (e) {
          expect(e).toEqual(errorResponse);
          expect(store.userState).toBe(AuthUserStateStoreEnum.LoggedOut);
          expect(localStorage.getItem('nht-user')).toBeNull();

          errorCaught = true;
        }

        expect(errorCaught).toBe(true);
      } else {
        expect('user should be logged out').toBe('user is not logged out');
      }
    });

    it('sets user state to loading during sign up', async () => {
      if (store.proxy.isLoggedOut()) {
        (vi.spyOn(global, '$fetch') as any).mockImplementation(() => new Promise(resolve => setTimeout(() => {
          resolve(userMock);
        }, 100)));

        const signUpPromise = store.proxy.signUp(signUpData);

        expect(store.userState).toBe(AuthUserStateStoreEnum.Loading);

        await signUpPromise;
      } else {
        expect('user should be logged out').toBe('user is not logged out');
      }
    });
  });

  /* eslint-disable @typescript-eslint/no-unused-expressions */
  // these tests are purely designed for verifying the augmented types
  // that come from the AuthStore class via type generics, and methods which are available
  describe('advanced type checks', () => {
    describe('user', () => {
      it('is potentially null if user state is not known', () => {
        try {
          // @ts-expect-error - we aren't sure the user is logged in
          store.proxy.user.email;
        } catch {}
      });

      it('is a full user model if user is in logged in state', () => {
        if (store.proxy.isLoggedIn()) {
          // no type error
          store.proxy.user.email;
        }
      });
    });

    describe('logOut', () => {
      it('should only be available if user is logged in', () => {
        // @ts-expect-error - we aren't sure the user is logged in
        store.proxy.logOut();

        if (store.proxy.isLoggedIn()) {
          // no type error
          store.proxy.logOut();
        }
      });
    });

    describe('signUp', () => {
      it('should only be available if user is logged out', () => {
        // @ts-expect-error - we aren't sure the user is logged out
        store.proxy.signUp();

        if (store.proxy.isLoggedOut()) {
          // no type error
          store.proxy.signUp({ email: 'john@doe.com', announcements: true, password: 'SomePassword123' });
        }
      });
    });
  });

  /* eslint-enable @typescript-eslint/no-unused-expressions */
});
