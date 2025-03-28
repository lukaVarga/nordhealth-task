import { setActivePinia, createPinia } from 'pinia';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppSettingsStore, AppThemeStoreEnum } from '~/stores/app-settings.store';

let importedThemes: AppThemeStoreEnum[] = [];

vi.mock('@provetcloud/themes/lib/provet.css', async (importOriginal) => {
  importedThemes = importedThemes.concat(AppThemeStoreEnum.Light);

  return await importOriginal();
});

vi.mock('@provetcloud/themes/lib/provet-dark.css', async (importOriginal) => {
  importedThemes = importedThemes.concat(AppThemeStoreEnum.Dark);

  return await importOriginal();
});

describe('AppSettingsStore', () => {
  let store: ReturnType<typeof useAppSettingsStore>;
  let matchMediaSpy: Mock;

  beforeEach(() => {
    matchMediaSpy = vi.fn().mockReturnValue({ matches: true });
    vi.stubGlobal('matchMedia', matchMediaSpy);

    setActivePinia(createPinia());
    store = useAppSettingsStore();
  });

  describe('setAppTheme', () => {
    it('sets the theme correctly and imports the related css', () => {
      store.setAppTheme(AppThemeStoreEnum.Dark);
      expect(store.themePreference).toBe(AppThemeStoreEnum.Dark);
      expect(importedThemes).toEqual([AppThemeStoreEnum.Dark]);
    });

    it('persists the theme in localStorage', () => {
      store.setAppTheme(AppThemeStoreEnum.Dark);
      expect(localStorage.getItem('nht-theme')).toBe(AppThemeStoreEnum.Dark);
    });
  });

  describe('initialization', () => {
    it('uses auto theme when no theme is set in localStorage', () => {
      store = useAppSettingsStore();
      expect(store.themePreference).toBe(AppThemeStoreEnum.Auto);
    });

    it('loads the theme from localStorage on initialization', () => {
      localStorage.setItem('nht-theme', AppThemeStoreEnum.Dark);
      store = useAppSettingsStore();
      expect(store.themePreference).toBe(AppThemeStoreEnum.Dark);
    });
  });
});
