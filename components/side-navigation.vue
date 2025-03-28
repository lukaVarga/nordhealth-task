<script setup lang="ts">
import ThemeSelector from '~/components/theme-selector.vue';
</script>

<template>
  <provet-navigation slot="nav">
    <provet-dropdown
      slot="header"
      expand
    >
      <provet-button
        slot="toggle"
        expand
      >
        <provet-avatar
          slot="start"
          name="Luka Varga"
          variant="square"
        >
          LV
        </provet-avatar>
        Luka Varga
      </provet-button>
      <provet-dropdown-group heading="varga.luka93@gmail.com">
        <provet-dropdown-item
          data-testid="linkedin"
          href="https://www.linkedin.com/in/luka-varga-6ab348123/"
          target="_blank"
        >
          <provet-avatar
            slot="start"
            name="LinkedIn"
            size="s"
            variant="square"
            style="--n-avatar-color: var(--n-color-text-success)"
          >
            LI
          </provet-avatar>
          LinkedIn
        </provet-dropdown-item>
        <provet-dropdown-item
          data-testid="github"
          href="https://github.com/lukaVarga"
          target="_blank"
        >
          <provet-avatar
            slot="start"
            name="Github"
            size="s"
            variant="square"
            style="--n-avatar-color: var(--n-color-text)"
          >
            GH
          </provet-avatar>
          Github
        </provet-dropdown-item>
      </provet-dropdown-group>
      <ThemeSelector />
    </provet-dropdown>

    <provet-nav-group heading="Dummy dashboard">
      <NuxtLink to="/">
        <provet-nav-item
          icon="interface-like"
        >
          Testing scenarios
        </provet-nav-item>
      </NuxtLink>
    </provet-nav-group>
  </provet-navigation>
</template>
