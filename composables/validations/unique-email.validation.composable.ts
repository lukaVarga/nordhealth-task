import type { UnwrapRef } from 'vue';

const emailValidationResults: Record<string, boolean> = {};

export default async (email: string, emailValidationInProgress: Ref<UnwrapRef<boolean>>): Promise<boolean> => {
  if (email in emailValidationResults) {
    return emailValidationResults[email];
  }

  emailValidationInProgress.value = true;
  let emailAvailable: boolean = true;

  try {
    await $fetch('/api/auth/check-email', {
      method: 'GET',
      query: { email },
      onResponseError({ response }) {
        emailAvailable = response.status !== 422;
      },
    });
  } catch {} finally {
    emailValidationInProgress.value = false;
  }

  emailValidationResults[email] = emailAvailable;

  // consider the validation results as valid for 60 seconds
  setTimeout(() => {
    delete emailValidationResults[email];
  }, 60_000);

  return emailAvailable;
};
