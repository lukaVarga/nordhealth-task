import { useAuthStore } from '~/stores/auth.store';
import { useTestingScenariosStore } from '~/stores/testing-scenarios.store';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  const testingScenarios = useTestingScenariosStore();

  if (authStore.proxy.isLoggedIn()) {
    testingScenarios.markScenarioAsDone('signUpPageInaccessible');

    return navigateTo('/');
  }
});
