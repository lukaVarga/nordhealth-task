<script setup lang="ts">
import { useTestingScenariosStore } from '~/stores/testing-scenarios.store';

const testingScenarios = useTestingScenariosStore();
</script>

<template>
  <provet-stack gap="l">
    <provet-card>
      <h2 slot="header">
        Testing scenarios - make sure you revisit the page to see what you still need to test
      </h2>
      <provet-banner
        data-testid="sign-up-completed"
        :variant="testingScenarios.signUpCompleted ? 'success' : 'warning'"
        class="n-margin-be-l"
      >
        Sign up with a new email address - you should be redirected to the success page
      </provet-banner>
      <provet-banner
        data-testid="sign-up-inaccessible"
        :variant="testingScenarios.signUpPageInaccessible ? 'success' : 'warning'"
        class="n-margin-be-l"
      >
        Try going to /sign-up manually or via browser back without logging out - you should be redirected to index page
      </provet-banner>
      <provet-banner
        data-testid="sign-up-using-same-email"
        :variant="testingScenarios.signingUpWithSameEmail ? 'success' : 'warning'"
        class="n-margin-be-l"
      >
        Try to sign up again using the same email address - you should see the error message that the user is already registered
      </provet-banner>
    </provet-card>
  </provet-stack>
</template>
