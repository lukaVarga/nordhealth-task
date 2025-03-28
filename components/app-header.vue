<script setup lang="ts">
import { AuthUserStateStoreEnum, useAuthStore } from '~/stores/auth.store';

const userStates: typeof AuthUserStateStoreEnum = AuthUserStateStoreEnum;
const authStore = useAuthStore();
</script>

<template>
  <provet-header slot="header">
    <h1 class="n-typescale-l">
      Nordhealth task
    </h1>

    <template
      v-if="authStore.userState === userStates.Loading"
    >
      <provet-spinner
        size="l"
        data-testid="loading-spinner"
      />
    </template>

    <template v-else>
      <template v-if="authStore.proxy.isLoggedIn()">
        <provet-stack
          slot="end"
          direction="horizontal"
        >
          <provet-dropdown size="s">
            <provet-button
              slot="toggle"
              data-testid="user-dropdown-button"
              variant="primary"
            >
              <provet-icon
                slot="start"
                name="user-single"
              />
              {{ authStore.proxy.user.email }}
            </provet-button>
            <provet-dropdown-item
              data-testid="log-out-button"
              @click="authStore.proxy.logOut"
            >
              Log out
            </provet-dropdown-item>
          </provet-dropdown>
        </provet-stack>
      </template>

      <template v-else>
        <NuxtLink
          slot="end"
          to="/sign-up"
        >
          <provet-button
            data-testid="sign-up-button"
            variant="primary"
          >
            Sign up
          </provet-button>
        </NuxtLink>
      </template>
    </template>
  </provet-header>
</template>
