<template>
  <div class="registration-main">
    <div class="field-container" v-for="(field, i) in fields" :key="i">
      <BaseInput
        :label="field.label"
        :name="field.placeholder"
        @input="[checkValid($event, i), setValue($event, i)]"
        :valid="field.valid"
        :type="field.type"
        :id="'field-registration-' + field.label.toLowerCase()"
        max="9999-12-31"
      />
      <Transition>
        <BaseMessage v-if="field.invalidMessage && field.valid === 'invalid'" alert="danger">{{
          field.invalidMessage
        }}</BaseMessage>
      </Transition>
    </div>
  </div>
  <BaseButton v-if="showButton" @click="nextStep" class="btn-continue">Continue</BaseButton>
  <p class="footnote">
    Already have an account?
    <router-link class="register-link" :to="{ name: LOGIN }"> Log in </router-link>
  </p>
</template>

<script lang="ts">
import _ from 'lodash';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import isOlder from '@/utils/isOlder';
import api from '@/utils/api/client';
import { InvalidMessage, NamePages } from '@/types/enums';
import type { RegistrationMainData } from '@/types/types';
import toCamelCase from '@/utils/toCamelCase';
import BaseButton from './shared/BaseButton.vue';

interface MainFields {
  valid: boolean;
  response: {};
}

export default {
  emits: ['valid-all-main-fields'],
  components: {
    BaseInput,
    BaseMessage,
    BaseButton,
  },
  // eslint-disable-next-line max-lines-per-function
  data(): {
    LOGIN: string;
    showButton: boolean;
    mainFields: MainFields;
    fields: RegistrationMainData[];
    } {
    return {
      LOGIN: NamePages.Login,
      showButton: true,
      mainFields: {} as MainFields,
      fields: [
        {
          label: 'Email',
          pattern:
            /^((?:[A-Za-z0-9!#$%&'*+\-\\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/,
          placeholder: 'example@email.com',
          type: 'email',
          invalidMessage: InvalidMessage.Email,
        },
        {
          label: 'Password',
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          placeholder: 'Example1',
          type: 'password',
          invalidMessage: InvalidMessage.Password,
        },
        {
          label: 'First Name',
          pattern: /^[a-zA-Z]+$/,
          placeholder: 'John',
          invalidMessage: InvalidMessage.FirstName,
        },
        {
          label: 'Last Name',
          pattern: /^[a-zA-Z]+$/,
          placeholder: 'Smith',
          invalidMessage: InvalidMessage.LastName,
        },
        {
          label: 'Date of birth',
          type: 'date',
          invalidMessage: InvalidMessage.Date,
        },
      ],
    };
  },
  methods: {
    debounceEmail: _.debounce(
      (email: string, fieldEmail: RegistrationMainData) => {
        const field = fieldEmail;
        api.isEmailAvailable(email).then((response) => {
          if (!response.ok) {
            field.valid = 'invalid';
            field.invalidMessage = response.message;
          } else {
            field.invalidMessage = InvalidMessage.Email;
          }
        });
      },
      1000,
      { leading: true },
    ),

    checkValid(e: Event, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];

      if (input !== null && field.type === 'email') {
        const email = input.value;
        this.debounceEmail(email, field);
      }
      if (input !== null && field.pattern) {
        field.valid = field.pattern.test(input.value) ? 'valid' : 'invalid';
      }
      if (input !== null && field.type === 'date') {
        const date = input.value;
        field.valid = isOlder(date, 13) ? 'valid' : 'invalid';
      }
    },

    setValue(e: Event, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];

      if (input !== null) field.value = input.value;
      if (this.fields.every((elem) => elem.value !== '' && elem.valid === 'valid')) {
        const body = this.fields.map((elem) => [toCamelCase(elem.label), elem.value]);
        const response = Object.fromEntries(body);
        this.mainFields = { valid: true, response };
      } else {
        this.mainFields = { valid: false, response: {} };
      }
      this.$emit('valid-all-main-fields', this.mainFields);
    },

    nextStep(): void {
      if (this.mainFields.valid) {
        this.showButton = false;
      }
      this.$emit('valid-all-main-fields', { ...this.mainFields, nextStepClick: true });
    },
  },
};
</script>
<style scoped>
.registration-main {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
}
.field-container {
  &:nth-child(1),
  &:nth-child(2) {
    grid-column: span 3;
    grid-row: 1;
  }
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    grid-column: span 2;
    grid-row: 2;
  }
}
.btn-continue {
  width: max-content;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
