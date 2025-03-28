<script setup lang="ts">
import SideNavigation from '~/components/side-navigation.vue';
</script>

<template>
  <provet-layout class="nht-default-layout">
    <SideNavigation />

    <slot />
  </provet-layout>
</template>
