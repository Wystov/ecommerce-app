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

export default {
  emits: ['valid-all-main-fields'],
  components: {
    BaseInput,
    BaseMessage,
  },
  data(): {
    fields: RegistrationMainData[];
    } {
    return {
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
            return;
          }
          field.valid = 'valid';
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
        this.$emit('valid-all-main-fields', { valid: true, response });
      } else {
        this.$emit('valid-all-main-fields', { valid: false, response: {} });
      }
    },
  },
};
</script>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
