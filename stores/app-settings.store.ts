import { defineStore } from 'pinia';

export enum AppThemeStoreEnum {
  Auto = 'auto',
  Dark = 'dark',
  Light = 'light',
}

const themeKey: string = 'nht-theme';

// for a more complex store, it'd make more sense to have eg. 'nht-app-settings' as the key and the value in object shape
export const useAppSettingsStore = defineStore('app-settings', () => {
  // in case of SSR, settings would have to be saved in cookies instead of LS so they could be accessible on the server
  const themePreference: ComputedRef<AppThemeStoreEnum>
    = computed(() => localStorage.getItem(themeKey) as AppThemeStoreEnum | null ?? AppThemeStoreEnum.Auto);

  function setupDarkModeByDefault(): boolean {
    const darkMode: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    return darkMode.matches;
  }

  async function initThemePreference(preference: AppThemeStoreEnum): Promise<void> {
    if (preference === AppThemeStoreEnum.Dark || (
      preference === AppThemeStoreEnum.Auto && setupDarkModeByDefault()
    )) {
      await import('@provetcloud/themes/lib/provet-dark.css');
    } else {
      await import('@provetcloud/themes/lib/provet.css');
    }
  }

  initThemePreference(themePreference.value);

  function setAppTheme(newTheme: AppThemeStoreEnum): void {
    localStorage.setItem(themeKey, newTheme);

    initThemePreference(newTheme);
  }

  return { setAppTheme, themePreference };
});
