import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import type { mount } from '@vue/test-utils';
import Welcome from '~/pages/welcome.vue';

describe('Welcome Page', () => {
  let wrapper: ReturnType<typeof mount<typeof Welcome>>;

  beforeEach(async () => {
    localStorage.setItem('nht-user', JSON.stringify({
      email: 'john@doe.com',
    }));

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        auth: {
          userState: AuthUserStateStoreEnum.LoggedIn,
        },
      },
    });

    wrapper = await mountSuspended(Welcome, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('displays a welcome message', () => {
    expect(wrapper.html()).toContain('Welcome john@doe.com');
  });
});
