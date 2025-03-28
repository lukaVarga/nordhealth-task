import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import type { DOMWrapper, mount } from '@vue/test-utils';
import type { Input, Checkbox } from '@provetcloud/web-components';
import flushPromises from 'flush-promises';
import waitForExpect from 'wait-for-expect';
import SignUp from '~/pages/sign-up.vue';
import { AuthUserStateStoreEnum, useAuthStore } from '~/stores/auth.store';
import { useTestingScenariosStore } from '~/stores/testing-scenarios.store';

vi.mock('~/composables/validations/unique-email.validation.composable', () => ({
  default: vi.fn().mockImplementation((email: string) => email !== 'already@taken.com'),
}));

mockNuxtImport('navigateTo', () => vi.fn());

describe('SignUp Page', () => {
  let wrapper: ReturnType<typeof mount<typeof SignUp>>;
  let authStore: ReturnType<typeof useAuthStore>;
  let testingScenariosStore: ReturnType<typeof useTestingScenariosStore>;

  beforeEach(async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        auth: {
          userState: AuthUserStateStoreEnum.LoggedOut,
        },
        'testing-scenarios': {},
      },
    });

    wrapper = await mountSuspended(SignUp, {
      global: {
        plugins: [pinia],
      },
    });

    authStore = useAuthStore(pinia);
    testingScenariosStore = useTestingScenariosStore(pinia);
  });

  it('shows the email, password and announcements fields', () => {
    expect(wrapper.find('[data-testid="email"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="password"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="announcements"]').exists()).toBe(true);
  });

  it('shows the sign up button', () => {
    expect(wrapper.find('[data-testid="sign-up-submit"]').exists()).toBe(true);
  });

  it('doesnt show the sign up error', () => {
    expect(wrapper.find('[data-testid="sign-up-error"]').exists()).toBe(false);
  });

  it('toggles password visibility when toggle button is clicked', async () => {
    const passwordField: DOMWrapper<Input> = wrapper.find('[data-testid="password"]');

    const button = passwordField.find('provet-button');
    expect(wrapper.vm.passwordInputIcon).toEqual('interface-edit-on');
    await button.trigger('click');
    expect(passwordField.element.type).toEqual('text');
    expect(wrapper.vm.passwordInputIcon).toEqual('interface-lock');
    await button.trigger('click');
    expect(passwordField.element.type).toEqual('password');
  });

  describe('validations', () => {
    describe('email', () => {
      let emailField: DOMWrapper<Input>;

      beforeEach(() => {
        emailField = wrapper.find('[data-testid="email"]');
      });

      it('shows required error when email is empty', async () => {
        emailField.element.value = '';
        await emailField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(emailField.element.error).toEqual('Email is required');
        });
      });

      it('shows invalid email error when email is invalid', async () => {
        emailField.element.value = 'foo@';
        await emailField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(emailField.element.error).toEqual('Enter a valid email');
        });
      });

      it('shows email taken error when email is already taken', async () => {
        emailField.element.value = 'already@taken.com';
        await emailField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(emailField.element.error).toEqual('Email is already taken');
        });
      });

      it('shows no error if email is valid and isnt taken', async () => {
        emailField.element.value = 'not@taken.com';
        await emailField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(emailField.element.error).toBeUndefined();
        });
      });

      it('shows the loading spinner when email validation is in progress', async () => {
        (wrapper.vm.emailValidationInProgress as any).value = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('provet-spinner').exists()).toBe(true);
      });
    });

    describe('password', () => {
      let passwordField: DOMWrapper<Input>;

      beforeEach(() => {
        passwordField = wrapper.find('[data-testid="password"]');
      });

      it('shows required error when password is empty', async () => {
        passwordField.element.value = '';
        await passwordField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(passwordField.element.error).toEqual('Password is required');
        });
      });

      it('shows password must contain at least one lowercase letter error', async () => {
        passwordField.element.value = 'AB';
        await passwordField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(passwordField.element.error).toEqual('Password must contain at least one lowercase letter');
        });
      });

      it('shows password must contain at least one uppercase letter error', async () => {
        passwordField.element.value = 'ab';
        await passwordField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(passwordField.element.error).toEqual('Password must contain at least one uppercase letter');
        });
      });

      it('shows password must contain at least one number error', async () => {
        passwordField.element.value = 'abAA';
        await passwordField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(passwordField.element.error).toEqual('Password must contain at least one number');
        });
      });

      it('shows password must be at least 8 characters', async () => {
        passwordField.element.value = 'abAA1';
        await passwordField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(passwordField.element.error).toEqual('Password must be at least 8 characters');
        });
      });

      it('shows no error if password is valid', async () => {
        passwordField.element.value = 'Password1';
        await passwordField.trigger('input');

        await flushPromises();

        await waitForExpect(() => {
          expect(passwordField.element.error).toBeUndefined();
        });
      });
    });
  });

  describe('sign up', () => {
    let signUpForm: DOMWrapper<HTMLElement>;

    beforeEach(() => {
      signUpForm = wrapper.find('[data-testid="sign-up-form"]');
      vi.spyOn(authStore.proxy, 'signUp');
    });

    describe('form is invalid', () => {
      it('doesnt call signUp', async () => {
        await signUpForm.trigger('submit');

        await waitForExpect(() => {
          expect(authStore.proxy.signUp).not.toHaveBeenCalled();
        });
      });
    });

    describe('form is valid', () => {
      let emailField: DOMWrapper<Input>;
      let passwordField: DOMWrapper<Input>;
      let announcementsField: DOMWrapper<Checkbox>;
      let email: string;
      let password: string;

      beforeEach(async () => {
        emailField = wrapper.find('[data-testid="email"]');
        passwordField = wrapper.find('[data-testid="password"]');
        announcementsField = wrapper.find('[data-testid="announcements"]');

        email = 'not@taken.com';
        password = 'Password1';

        emailField.element.value = email;
        await emailField.trigger('input');

        await flushPromises();

        // @ts-ignore
        announcementsField.element.value = true;
        await announcementsField.trigger('input');
        await flushPromises();

        passwordField.element.value = password;
        await passwordField.trigger('input');

        await flushPromises();
      });

      it('calls signUp with the correct data', async () => {
        await signUpForm.trigger('submit');

        await flushPromises();

        await waitForExpect(() => {
          expect(authStore.proxy.signUp).toHaveBeenCalledWith({ email, password, announcements: true });
        });

        describe('sign up is successful', () => {
          beforeEach(() => {
            (authStore.proxy.signUp as Mock).mockResolvedValue({});
          });

          it('navigates to /welcome page', async () => {
            await signUpForm.trigger('submit');

            await flushPromises();

            await waitForExpect(() => {
              expect(navigateTo).toHaveBeenCalledWith('/welcome');
            });
          });

          it('marks sign up completed scenario as done', async () => {
            await signUpForm.trigger('submit');

            await flushPromises();

            await waitForExpect(() => {
              expect(testingScenariosStore.markScenarioAsDone).toHaveBeenCalledWith('signUpCompleted');
            });
          });

          it('does not display error message', async () => {
            await signUpForm.trigger('submit');

            await flushPromises();

            await waitForExpect(() => {
              expect(wrapper.find('[data-testid="sign-up-error"]').exists()).toBe(false);
            });
          });
        });

        describe('sign up errors', () => {
          beforeEach(() => {
            (authStore.proxy.signUp as Mock).mockRejectedValue({});
          });

          it('does not navigate away', async () => {
            await signUpForm.trigger('submit');

            await flushPromises();

            await waitForExpect(() => {
              expect(navigateTo).not.toHaveBeenCalled();
            });
          });

          it('does not mark sign up completed scenario as done', async () => {
            await signUpForm.trigger('submit');

            await flushPromises();

            await waitForExpect(() => {
              expect(testingScenariosStore.markScenarioAsDone).not.toHaveBeenCalled();
            });
          });

          it('displays error message when sign up fails', async () => {
            await signUpForm.trigger('submit');

            await flushPromises();

            await waitForExpect(() => {
              expect(wrapper.find('[data-testid="sign-up-error"]').exists()).toBe(true);
            });
          });
        });
      });
    });
  });
});
