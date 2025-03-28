import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { AuthUserStateStoreEnum, useAuthStore } from '~/stores/auth.store';
import loggedIn from '~/middleware/logged-in';

mockNuxtImport('navigateTo', () => vi.fn());

describe('loggedIn Middleware', () => {
  let store: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuthStore();
  });

  it('allows access when user is logged in', () => {
    store.userState = AuthUserStateStoreEnum.LoggedIn;
    loggedIn({} as any, {} as any);
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('redirects to index page when user is not logged in', () => {
    store.userState = AuthUserStateStoreEnum.LoggedOut;
    loggedIn({} as any, {} as any);

    expect(navigateTo).toHaveBeenCalledWith('/');
  });
});
