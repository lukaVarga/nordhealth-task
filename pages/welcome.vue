<script setup lang="ts">
definePageMeta({
  middleware: [
    'logged-in',
  ],
});

const authStore = useAuthStore();
</script>

<template>
  <provet-stack
    v-if="authStore.proxy.isLoggedIn()"
    gap="l"
  >
    <provet-card>
      <h2 slot="header">
        Welcome {{ authStore.proxy.user.email }}!
      </h2>
      <provet-banner
        variant="success"
        class="n-margin-be-l"
      >
        You have successfully logged in!
        Make sure you test out other scenarios as well.
      </provet-banner>
    </provet-card>
  </provet-stack>
</template>
