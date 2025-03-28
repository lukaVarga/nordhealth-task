import type { DOMWrapper, mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ThemeSelector from '~/components/theme-selector.vue';
import { useAppSettingsStore, AppThemeStoreEnum } from '~/stores/app-settings.store';

describe('ThemeSelector', () => {
  let wrapper: ReturnType<typeof mount<typeof ThemeSelector>>;
  let store: ReturnType<typeof useAppSettingsStore>;

  beforeEach(async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        'app-settings': {
          themePreference: AppThemeStoreEnum.Auto,
        },
      },
    });

    wrapper = await mountSuspended(ThemeSelector, {
      global: {
        plugins: [pinia],
      },
    });

    store = useAppSettingsStore(pinia);
    store.setAppTheme = vi.fn();
  });

  it('renders correctly with the default theme', () => {
    const select: DOMWrapper<HTMLSelectElement> = wrapper.find('[data-testid="theme-selector"]');

    expect(select.element.value).toBe(AppThemeStoreEnum.Auto);
  });

  it('changes theme in the store when a new theme is selected', async () => {
    const select: DOMWrapper<HTMLSelectElement> = wrapper.find('[data-testid="theme-selector"]');
    select.element.value = AppThemeStoreEnum.Dark;

    await select.trigger('change');
    expect(store.setAppTheme).toHaveBeenCalledWith(AppThemeStoreEnum.Dark);
  });

  it('displays the correct options', () => {
    const options = wrapper.find('[data-testid="theme-selector"]').findAll('option');

    expect(options.length).toBe(3);
    expect(options[0].element.value).toBe(AppThemeStoreEnum.Light);
    expect(options[1].element.value).toBe(AppThemeStoreEnum.Dark);
    expect(options[2].element.value).toBe(AppThemeStoreEnum.Auto);
  });
});
