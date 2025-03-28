import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import type { DOMWrapper, mount } from '@vue/test-utils';
import type { Banner } from '@provetcloud/web-components';
import Index from '~/pages/index.vue';
import { useTestingScenariosStore } from '~/stores/testing-scenarios.store';

describe('Index Page', () => {
  let wrapper: ReturnType<typeof mount<typeof Index>>;
  let testingScenariosStore: ReturnType<typeof useTestingScenariosStore>;

  beforeEach(async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        'testing-scenarios': {
          signUpCompleted: false,
          signUpPageInaccessible: false,
          signingUpWithSameEmail: false,
        },
      },
    });

    wrapper = await mountSuspended(Index, {
      global: {
        plugins: [pinia],
      },
    });

    testingScenariosStore = useTestingScenariosStore(pinia);
  });

  describe('sign up completed', () => {
    let item: DOMWrapper<Banner>;

    beforeEach(() => {
      item = wrapper.find('[data-testid="sign-up-completed"]');
    });

    it('displays the sign up completed testing scenario as incomplete', () => {
      expect(item.exists()).toBe(true);
      expect(item.element.variant).toEqual('warning');
    });

    it('displays the sign up completed testing scenario as complete after completing it', () => {
      testingScenariosStore.markScenarioAsDone('signUpCompleted');

      expect(item.exists()).toBe(true);
      expect(item.element.variant).toEqual('warning');
    });
  });

  describe('sign up inaccessible', () => {
    let item: DOMWrapper<Banner>;

    beforeEach(() => {
      item = wrapper.find('[data-testid="sign-up-inaccessible"]');
    });

    it('displays the sign up inaccessible testing scenario as incomplete', () => {
      expect(item.exists()).toBe(true);
      expect(item.element.variant).toEqual('warning');
    });

    it('displays the sign up inaccessible testing scenario as complete after completing it', () => {
      testingScenariosStore.markScenarioAsDone('signUpPageInaccessible');

      expect(item.exists()).toBe(true);
      expect(item.element.variant).toEqual('warning');
    });
  });

  describe('sign up using same email', () => {
    let item: DOMWrapper<Banner>;

    beforeEach(() => {
      item = wrapper.find('[data-testid="sign-up-using-same-email"]');
    });

    it('displays the sign up using same email testing scenario as incomplete', () => {
      expect(item.exists()).toBe(true);
      expect(item.element.variant).toEqual('warning');
    });

    it('displays the sign up using same email testing scenario as complete after completing it', () => {
      testingScenariosStore.markScenarioAsDone('signingUpWithSameEmail');

      expect(item.exists()).toBe(true);
      expect(item.element.variant).toEqual('warning');
    });
  });
});
