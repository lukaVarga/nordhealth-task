import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import type { UnwrapRef } from 'vue';
import type { H3Event } from 'h3';
import useUniqueEmailValidation from '~/composables/validations/unique-email.validation.composable';

let emailNum: number = 0;

describe('useUniqueEmailValidation', () => {
  let emailValidationInProgress: Ref<UnwrapRef<boolean>>;

  function getUniqueEmail(): string {
    return `some-email-${emailNum++}@foo.com`;
  }

  beforeEach(() => {
    emailValidationInProgress = ref(false);
  });

  describe('checking email for the first time', () => {
    it('sets emailValidationInProgress to true', async () => {
      useUniqueEmailValidation(getUniqueEmail(), emailValidationInProgress);

      expect(emailValidationInProgress.value).toBe(true);
    });

    describe('email does not exist', () => {
      beforeEach(() => {
        registerEndpoint('/api/auth/check-email', {
          handler: () => new Promise((resolve) => {
            setTimeout(() => {
              resolve('OK');
            }, 50);
          }),
          method: 'GET',
        });
      });

      it('returns true', async () => {
        const validationResult: boolean = await useUniqueEmailValidation(getUniqueEmail(), emailValidationInProgress);

        expect(validationResult).toBe(true);
      });

      it('sets emailValidationInProgress to false', async () => {
        await useUniqueEmailValidation(getUniqueEmail(), emailValidationInProgress);

        expect(emailValidationInProgress.value).toBe(false);
      });
    });

    describe('email exists', () => {
      beforeEach(() => {
        registerEndpoint('/api/auth/check-email', {
          handler: (req: H3Event) => req.respondWith({
            headers: new Headers(),
            ok: false,
            statusText: 'Email already exists',
            status: 422,
          } as Response),
          method: 'GET',
        });
      });

      it('returns false', async () => {
        const validationResult: boolean = await useUniqueEmailValidation(getUniqueEmail(), emailValidationInProgress);

        expect(validationResult).toBe(false);
      });

      it('sets emailValidationInProgress to false', async () => {
        await useUniqueEmailValidation(getUniqueEmail(), emailValidationInProgress);

        expect(emailValidationInProgress.value).toBe(false);
      });
    });
  });

  describe('checking email for the second time', () => {
    let email: string;
    let fetchMock: Mock;

    beforeEach(() => {
      fetchMock = vi.fn();
      vi.useFakeTimers();
      email = getUniqueEmail();

      fetchMock.mockResolvedValue({});
      vi.stubGlobal('$fetch', fetchMock);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('only calls $fetch once per minute for the same email', async () => {
      await useUniqueEmailValidation(email, emailValidationInProgress);
      await useUniqueEmailValidation(email, emailValidationInProgress);

      expect(fetchMock.mock.calls.length).toBe(1);
      vi.advanceTimersByTime(59_000);

      await useUniqueEmailValidation(email, emailValidationInProgress);
      expect(fetchMock.mock.calls.length).toBe(1);

      vi.advanceTimersByTime(2_000);

      await useUniqueEmailValidation(email, emailValidationInProgress);
      expect(fetchMock.mock.calls.length).toBe(2);

      await useUniqueEmailValidation(getUniqueEmail(), emailValidationInProgress);
      expect(fetchMock.mock.calls.length).toBe(3);
    });
  });
});
