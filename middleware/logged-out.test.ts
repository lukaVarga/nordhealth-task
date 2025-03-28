import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { AuthUserStateStoreEnum, useAuthStore } from '~/stores/auth.store';
import loggedOut from '~/middleware/logged-out';
import { useTestingScenariosStore } from '~/stores/testing-scenarios.store';

mockNuxtImport('navigateTo', () => vi.fn());

describe('loggedOut Middleware', () => {
  let store: ReturnType<typeof useAuthStore>;
  let testingScenarios: ReturnType<typeof useTestingScenariosStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuthStore();
    testingScenarios = useTestingScenariosStore();
  });

  describe('user is logged out', () => {
    beforeEach(() => {
      store.userState = AuthUserStateStoreEnum.LoggedOut;
    });

    it('allows access when user is logged out', () => {
      loggedOut({} as any, {} as any);

      expect(navigateTo).not.toHaveBeenCalled();
    });

    it('does not mark testing scenario as done', () => {
      vi.spyOn(testingScenarios, 'markScenarioAsDone');

      loggedOut({} as any, {} as any);

      expect(testingScenarios.markScenarioAsDone).not.toHaveBeenCalled();
    });
  });

  describe('user is logged in', () => {
    beforeEach(() => {
      store.userState = AuthUserStateStoreEnum.LoggedIn;
    });

    it('redirects to index page when user is logged in', () => {
      loggedOut({} as any, {} as any);

      expect(navigateTo).toHaveBeenCalledWith('/');
    });

    it('marks testing scenario as done', () => {
      vi.spyOn(testingScenarios, 'markScenarioAsDone');

      loggedOut({} as any, {} as any);

      expect(testingScenarios.markScenarioAsDone).toHaveBeenCalledWith('signUpPageInaccessible');
    });
  });
});
