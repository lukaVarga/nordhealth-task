import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import type { mount } from '@vue/test-utils';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import AppHeader from '~/components/app-header.vue';
import { AuthUserStateStoreEnum } from '~/stores/auth.store';

describe('AppHeader', () => {
  let wrapper: ReturnType<typeof mount<typeof AppHeader>>;
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        auth: {
          userState: AuthUserStateStoreEnum.LoggedOut,
          proxy: {
            user: null,
            logOut: vi.fn(),
          },
        },
      },
    });

    wrapper = await mountSuspended(AppHeader, {
      global: {
        plugins: [pinia],
      },
    });

    authStore = useAuthStore(pinia);
  });

  describe('when the store state is loading', () => {
    beforeEach(() => {
      authStore.userState = AuthUserStateStoreEnum.Loading;
    });

    it('shows the spinner', () => {
      expect(wrapper.html()).toContain('data-testid="loading-spinner"');
      expect(wrapper.html()).not.toContain('data-testid="user-dropdown-button"');
      expect(wrapper.html()).not.toContain('data-testid="sign-up-button"');
    });
  });

  describe('when the store state is logged in', () => {
    beforeEach(() => {
      authStore.userState = AuthUserStateStoreEnum.LoggedIn;

      authStore.proxy = {
        ...authStore.proxy,
        isLoggedIn: authStore.proxy.isLoggedIn,
        isLoggedOut: authStore.proxy.isLoggedOut,
        logOut: vi.fn() as any,
        user: {
          id: 324,
          email: 'test@test.com',
          announcements: true,
          createdAt: new Date(),
        },
      };
    });

    it('shows the button with user email', () => {
      const button = wrapper.find('[data-testid="user-dropdown-button"]');
      expect(button.exists()).toBe(true);
      expect(button.html()).toContain(authStore.proxy.user!.email);
    });

    it('doesnt show the sign up button', () => {
      const button = wrapper.find('[data-testid="sign-up-button"]');
      expect(button.exists()).toBe(false);
    });

    it('calls logOut when the log out button is clicked', async () => {
      await wrapper.find('[data-testid="log-out-button"]').trigger('click');
      expect(authStore.proxy.logOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the store state is logged out', () => {
    beforeEach(() => {
      authStore.userState = AuthUserStateStoreEnum.LoggedOut;
    });

    it('shows the sign up button', () => {
      const button = wrapper.find('[data-testid="sign-up-button"]');
      expect(button.exists()).toBe(true);
      expect(button.html()).toContain('Sign up');
    });
  });
});
