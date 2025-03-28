<script setup lang="ts">
import AppHeader from '~/components/app-header.vue';
import SideNavigation from '~/components/side-navigation.vue';
</script>

<template>
  <provet-layout>
    <SideNavigation />

    <AppHeader />

    <slot />
  </provet-layout>
</template>
