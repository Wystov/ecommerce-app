<template>
  <div class="registration-main" @keydown.enter="showButton && nextStep()">
    <div class="field-container" v-for="(field, i) in fields" :key="i">
      <BaseInput
        :label="field.label"
        :hidePass="field.label === 'Password' ? hidePass : ''"
        @click="showPassword($event, i)"
        :name="field.placeholder"
        @input="handleInput($event, i)"
        :valid="field.valid"
        :value="field.value"
        :type="field.type"
        :id="'field-registration-' + field.label.toLowerCase()"
        max="9999-12-31"
        @focusin="field.showMessage = true"
        @focusout="field.showMessage = false"
      />
      <Transition>
        <BaseMessage
          absolute
          arrow="top"
          v-if="field.showMessage && field.valid === 'invalid'"
          alert="danger"
        >{{ field.invalidMessage }}</BaseMessage
        >
      </Transition>
    </div>
  </div>
  <BaseButton v-if="showButton" @click="nextStep" class="btn-continue">Continue</BaseButton>
</template>

<script lang="ts">
import _ from 'lodash';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import isOlder from '@/utils/isOlder';
import api from '@/utils/api/client';
import { InvalidMessage } from '@/types/enums';
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
    hidePass: string;
    showButton: boolean;
    mainFields: MainFields;
    fields: RegistrationMainData[];
    } {
    return {
      hidePass: 'show',
      showButton: true,
      mainFields: {} as MainFields,
      fields: [
        {
          label: 'Email',
          pattern:
            /^((?:[A-Za-z0-9!#$%&'*+\-\\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/,
          placeholder: 'example@email.com',
          type: 'text',
          invalidMessage: InvalidMessage.Email,
          showMessage: false,
          value: '',
        },
        {
          label: 'Password',
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          placeholder: 'Example1',
          type: 'password',
          invalidMessage: InvalidMessage.Password,
          showMessage: false,
          value: '',
        },
        {
          label: 'First Name',
          pattern: /^[a-zA-Z]+$/,
          placeholder: 'John',
          invalidMessage: InvalidMessage.FirstName,
          showMessage: false,
          value: '',
        },
        {
          label: 'Last Name',
          pattern: /^[a-zA-Z]+$/,
          placeholder: 'Smith',
          invalidMessage: InvalidMessage.LastName,
          showMessage: false,
          value: '',
        },
        {
          label: 'Date of birth',
          type: 'date',
          invalidMessage: InvalidMessage.Date,
          showMessage: false,
          value: '',
        },
      ],
    };
  },
  methods: {
    handleInput(event: Event, index: number): void {
      this.setValue(event, index);
      this.checkValid(index);
      this.readyData();
    },

    showPassword(e: InputEvent, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];
      if (!(input instanceof SVGElement)) {
        return;
      }
      if (this.hidePass === 'show') {
        this.hidePass = 'hide';
        field.type = 'text';
        return;
      }
      this.hidePass = 'show';
      field.type = 'password';
    },

    setValue(e: Event, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];

      field.value = input.value.trim();
    },

    checkValid(i: number): void {
      const field = this.fields[i];

      if (field.value === '') field.valid = '';

      if (field.value && field.pattern) {
        field.valid = field.pattern.test(field.value) ? 'valid' : 'invalid';
      }

      if (field.value && field.label === 'Email') {
        const email = field.value;
        if (field.valid === 'valid') this.debounceEmail(email, field);
        if (field.valid === 'invalid') field.invalidMessage = InvalidMessage.Email;
      }

      if (field.value && field.type === 'date') {
        const date = field.value;
        field.valid = isOlder(date, 13) ? 'valid' : 'invalid';
      }
    },

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

    readyData(): void {
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
.field-container :deep(.input-icon) {
  cursor: pointer;
}
.registration-main {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
}
.field-container {
  position: relative;
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
@media (max-width: 768px) {
  .registration-main {
    display: flex;
    flex-direction: column;
  }
}
</style>
