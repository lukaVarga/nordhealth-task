<script setup lang="ts">
import type { UnwrapRef } from 'vue';
import type { ObjectSchema } from 'yup';
import { object as yupObject, string as yupString, boolean as yupBoolean } from 'yup';
import { Form, Field } from 'vee-validate';
import { useAuthStore } from '~/stores/auth.store';
import type { IApiAuthSignUpPostRequest } from '~/server/api/auth/server.api.auth.types';
import uniqueEmailValidationComposable from '~/composables/validations/unique-email.validation.composable';
import { useTestingScenariosStore } from '~/stores/testing-scenarios.store';

definePageMeta({
  middleware: [
    'logged-out',
  ],
  layout: 'clean',
});

const authStore = useAuthStore();
const testingScenarios = useTestingScenariosStore();
const passwordInputType: Ref<UnwrapRef<'text' | 'password'>> = ref('password');
const passwordInputIcon = computed(() => (passwordInputType.value === 'password' ? 'interface-edit-on' : 'interface-lock'));

const emailValidationInProgress: Ref<UnwrapRef<boolean>> = ref(false);
const signUpErrored: Ref<UnwrapRef<boolean>> = ref(false);

const formSchema: ObjectSchema<IApiAuthSignUpPostRequest> = yupObject({
  announcements: yupBoolean(),
  email: yupString()
    .email('Enter a valid email')
    .required('Email is required')
    .test('unique-email', 'Email is already taken', async (email: string) => {
      const emailIsAvailable: boolean = await uniqueEmailValidationComposable(email, emailValidationInProgress);

      if (!emailIsAvailable) {
        testingScenarios.markScenarioAsDone('signingUpWithSameEmail');
      }

      return emailIsAvailable;
    }),
  password: yupString()
    .required('Password is required')
    .matches(/([a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/([A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .min(8, 'Password must be at least 8 characters'),
});

async function signUp(formData: IApiAuthSignUpPostRequest): Promise<void> {
  if (authStore.proxy.isLoggedOut()) {
    try {
      signUpErrored.value = false;

      await authStore.proxy.signUp(formData);

      await navigateTo('/welcome');

      testingScenarios.markScenarioAsDone('signUpCompleted');
    } catch {
      signUpErrored.value = true;
    }
  }
}

function togglePassword(): void {
  passwordInputType.value = passwordInputType.value === 'password' ? 'text' : 'password';
}

defineExpose({
  passwordInputIcon,
  emailValidationInProgress,
});
</script>

<template>
  <div>
    <Form
      id="sign-up"
      v-slot="{ values, isSubmitting }"
      data-testid="sign-up-form"
      :validation-schema="formSchema"
      @submit="signUp($event as IApiAuthSignUpPostRequest)"
    >
      <provet-banner
        v-if="signUpErrored"
        data-testid="sign-up-error"
        variant="danger"
        class="n-margin-be-l"
      >
        Something went wrong during signup. Please try again.
      </provet-banner>

      <provet-stack>
        <Field
          v-slot="{ field, errorMessage }"
          :validate-on-input="true"
          name="email"
        >
          <provet-input
            data-testid="email"
            label="Email"
            type="email"
            :name="field.name"
            placeholder="john@doe.com"
            :error="errorMessage"
            @input="field.onInput"
            @blur="field.onBlur"
          >
            <provet-spinner
              v-if="emailValidationInProgress"
              slot="end"
            />

            <provet-icon
              v-else
              slot="end"
              name="interface-email"
            />
          </provet-input>
        </Field>

        <Field
          v-slot="{ field, errorMessage }"
          name="password"
          :validate-on-input="true"
        >
          <provet-input
            data-testid="password"
            label="Password"
            :name="field.name"
            :type="passwordInputType"
            :error="errorMessage"
            @input="field.onInput"
            @blur="field.onBlur"
          >
            <provet-button
              slot="end"
              @click.prevent="togglePassword()"
            >
              <provet-icon :name="passwordInputIcon" />
            </provet-button>
          </provet-input>
        </Field>

        <Field
          v-slot="{ field, errorMessage }"
          name="announcements"
        >
          <provet-checkbox
            data-testid="announcements"
            label="Subscribe to product updates and announcements"
            :name="field.name"
            :value="values.announcements === 'true' ? 'false' : 'true'"
            :error="errorMessage"
            @input="field.onInput"
            @blur="field.onBlur"
          />
        </Field>

        <provet-button
          data-testid="sign-up-submit"
          variant="primary"
          type="submit"
          :loading="isSubmitting"
        >
          Sign up
        </provet-button>
      </provet-stack>
    </Form>
  </div>
</template>
