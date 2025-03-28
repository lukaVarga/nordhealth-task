import { defineStore } from 'pinia';

const storeKey: string = 'nht-testing-scenarios';

interface IStoreTestingScenarios {
  signUpCompleted: boolean;
  signUpPageInaccessible: boolean;
  signingUpWithSameEmail: boolean;
}

export const useTestingScenariosStore = defineStore('testing-scenarios', () => {
  const scenarioUpdate = ref(0);

  // in case of SSR, settings would have to be saved in cookies instead of LS so they could be accessible on the server
  const testingScenarios: ComputedRef<IStoreTestingScenarios> = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    scenarioUpdate.value; // to trigger reactivity since we're otherwise using localStorage directly

    const storedScenarios: string | null = localStorage.getItem(storeKey);

    if (storedScenarios) {
      return JSON.parse(storedScenarios);
    } else {
      return {
        signUpCompleted: false,
        signUpPageInaccessible: false,
        signingUpWithSameEmail: false,
      };
    }
  });

  const signUpCompleted: ComputedRef<boolean> = computed(() => testingScenarios.value.signUpCompleted);
  const signUpPageInaccessible: ComputedRef<boolean> = computed(() => testingScenarios.value.signUpPageInaccessible);
  const signingUpWithSameEmail: ComputedRef<boolean> = computed(() => testingScenarios.value.signingUpWithSameEmail);

  function markScenarioAsDone(scenario: keyof IStoreTestingScenarios): void {
    localStorage.setItem(storeKey, JSON.stringify({
      ...testingScenarios.value,
      [scenario]: true,
    }));

    scenarioUpdate.value++;
  }

  return { signUpCompleted, signUpPageInaccessible, signingUpWithSameEmail, markScenarioAsDone };
});
