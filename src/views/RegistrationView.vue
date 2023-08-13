<template>
  <h1 class="container">Registration</h1>

  <div class="field-container" v-for="(field, i) in fields" :key="i">
    <BaseInput :label="field.label" @focusout="checkValid($event, i)" :valid="field.valid" />
    <Transition>
      <BaseMessage v-if="field.invalidMessage && field.valid === 'invalid'" alert="danger">{{
        field.invalidMessage
      }}</BaseMessage>
    </Transition>
  </div>

  <BaseButton size="large">Submit</BaseButton>
</template>
-
<script lang="ts">
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';

export default {
  // eslint-disable-next-line max-lines-per-function
  data(): {
    fields: {
      label: string;
      pattern?: RegExp;
      valid?: 'valid' | 'invalid' | '';
      invalidMessage?: string;
    }[];
  } {
    return {
      fields: [
        {
          label: 'Email',
          pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}$/,
          valid: '',
          invalidMessage:
            'Email is not correct. A properly formatted email address (e.g., example@email.com)',
        },
        {
          label: 'Password',
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[0-9a-zA-Z!@#$%^&*]{8,}$/,
          invalidMessage:
            'Password is not correct. Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number',
        },
        {
          label: 'First Name',
          pattern: /^[a-zA-Z]+$/,
          invalidMessage:
            'First Name is not correct. Must contain at least one character and no special characters or numbers',
        },
        {
          label: 'Last Name',
          pattern: /^[a-zA-Z]+$/,
          invalidMessage:
            'First Name is not correct. Must contain at least one character and no special characters or numbers',
        },
        {
          label: 'Date of birth',
          invalidMessage:
            'Date of birth is not correct. A valid date input ensuring the user is above a certain age (e.g., 13 years old or older)',
        },
        {
          label: 'Street',
          pattern: /^.*\S.*$/,
          invalidMessage: 'Street is not correct. Must contain at least one character',
        },
        {
          label: 'City',
          pattern: /^[a-zA-Z\s]+$/,
          invalidMessage:
            'City is not correct. Must contain at least one character and no special characters or numbers',
        },
        {
          label: 'Postal Code',
          invalidMessage: 'Postal Code is not correct. Must follow the format for the country',
        },
        {
          label: 'Country',
          invalidMessage: 'Country is not correct. Please choose country',
        },
      ],
    };
  },
  components: {
    BaseButton,
    BaseInput,
    BaseMessage,
  },
  methods: {
    checkValid(e: Event, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];

      if (input !== null && field.pattern) {
        field.valid = field.pattern.test(input.value) ? 'valid' : 'invalid';
      }
    },
  },
};
</script>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
