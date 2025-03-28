<script setup lang="ts">
import type { AppThemeStoreEnum } from '~/stores/app-settings.store';
import { useAppSettingsStore } from '~/stores/app-settings.store';

const appSettingsStore = useAppSettingsStore();
const existingTheme: AppThemeStoreEnum = appSettingsStore.themePreference;

async function changeTheme(theme: AppThemeStoreEnum): Promise<void> {
  appSettingsStore.setAppTheme(theme);
}
</script>

<template>
  <provet-dropdown-item class="nht__theme-selector">
    <provet-select
      hide-label
      expand
      :value="existingTheme"
      data-testid="theme-selector"
      @change="changeTheme(($event.target as any).value)"
    >
      <provet-icon
        slot="icon"
        name="interface-mode-light"
      />
      <option value="light">
        Light theme
      </option>
      <option value="dark">
        Dark theme
      </option>
      <option value="auto">
        System preference
      </option>
    </provet-select>
  </provet-dropdown-item>
</template>

<style scoped>
.nht__theme-selector {
  &:hover {
    --n-dropdown-item-background-color: var(--n-color-active);
    --n-dropdown-item-color: var(--n-color-text);
  }
}
</style>
