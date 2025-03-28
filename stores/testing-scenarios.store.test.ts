import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTestingScenariosStore } from '~/stores/testing-scenarios.store';

describe('TestingScenariosStore', () => {
  let store: ReturnType<typeof useTestingScenariosStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useTestingScenariosStore();
  });

  describe('initialization', () => {
    it('initializes with default values set to false if localStorage is empty', () => {
      expect(store.signingUpWithSameEmail).toBe(false);
      expect(store.signUpCompleted).toBe(false);
      expect(store.signUpPageInaccessible).toBe(false);
    });

    it('initializes with values from localStorage if they are present', () => {
      localStorage.setItem('nht-testing-scenarios', JSON.stringify({
        signUpCompleted: true,
        signUpPageInaccessible: false,
        signingUpWithSameEmail: true,
      }));

      setActivePinia(createPinia());
      store = useTestingScenariosStore();

      expect(store.signingUpWithSameEmail).toBe(true);
      expect(store.signUpCompleted).toBe(true);
      expect(store.signUpPageInaccessible).toBe(false);
    });
  });

  describe('markScenarioAsDone', () => {
    it('sets the value of the scenario to true and updates the value in localStorage', () => {
      store.markScenarioAsDone('signUpCompleted');

      expect(store.signUpCompleted).toBe(true);
      expect(store.signUpPageInaccessible).toBe(false);
      expect(store.signingUpWithSameEmail).toBe(false);

      store.markScenarioAsDone('signUpPageInaccessible');

      expect(store.signUpCompleted).toBe(true);
      expect(store.signUpPageInaccessible).toBe(true);
      expect(store.signingUpWithSameEmail).toBe(false);

      expect(JSON.parse(localStorage.getItem('nht-testing-scenarios')!))
        .toEqual({
          signUpCompleted: true,
          signUpPageInaccessible: true,
          signingUpWithSameEmail: false,
        });
    });
  });
});
