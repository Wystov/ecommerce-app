<template>
  <div class="edit-form" @keydown.enter="nextStep()">
    <div class="field-container" v-for="(field, i) in fields" :key="i">
      <BaseInput
        :label="field.label"
        :name="getPlaceholder(field.placeholder)"
        @input="handleInput($event, i)"
        :valid="field.valid"
        :value="field.dateValue ? dateOfBirth : field.value"
        :type="field.type"
        :id="field.label.toLowerCase()"
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
  <BaseButton @click="updateInfo" class="btn-update">Update</BaseButton>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import type {
  MyCustomerUpdate,
  MyCustomerChangeEmailAction,
  MyCustomerSetFirstNameAction,
  MyCustomerSetLastNameAction,
  MyCustomerSetDateOfBirthAction,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/me';
import _ from 'lodash';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import isOlder from '@/utils/isOlder';
import api from '@/utils/api/client';
import { useUserStore } from '@/stores/user';
import { InvalidMessage } from '@/types/enums';
import type { RegistrationMainData, MainFields } from '@/types/types';
import BaseButton from './shared/BaseButton.vue';

export default {
  emits: ['valid-all-main-fields', 'close', 'showSuccessMessage'],
  computed: {
    ...mapStores(useUserStore),
    dateOfBirth(): string {
      return this.userStore.customerData.body.dateOfBirth;
    },
    newEmailData(): MyCustomerChangeEmailAction {
      const emailIndex = 3;
      const emailValue = this.fields[emailIndex].value;
      if (emailValue && emailValue !== '') {
        return { action: 'changeEmail',
          email: emailValue,
        };
      }
      return {
        action: 'changeEmail',
        email: this.getPlaceholder('email'),
      };
    },
    newFirstNameData(): MyCustomerSetFirstNameAction {
      const nameIndex = 0;
      const nameValue = this.fields[nameIndex].value;
      if (nameValue && nameValue !== '') {
        return { action: 'setFirstName',
          firstName: nameValue,
        };
      }
      return {
        action: 'setFirstName',
        firstName: this.getPlaceholder('firstName'),
      };
    },
    newLastNameData(): MyCustomerSetLastNameAction {
      const lastNameIndex = 1;
      const lastNameValue = this.fields[lastNameIndex].value;
      if (lastNameValue && lastNameValue !== '') {
        return { action: 'setLastName',
          lastName: lastNameValue,
        };
      }
      return {
        action: 'setLastName',
        lastName: this.getPlaceholder('lastName'),
      };
    },
    newDateOfBirthData(): MyCustomerSetDateOfBirthAction {
      const birthDateIndex = 2;
      const birthDateValue = this.fields[birthDateIndex].value;
      if (birthDateValue && birthDateValue !== '') {
        return { action: 'setDateOfBirth',
          dateOfBirth: birthDateValue,
        };
      }
      return {
        action: 'setDateOfBirth',
        dateOfBirth: this.getPlaceholder('dateOfBirth'),
      };
    },
    postData(): MyCustomerUpdate {
      return {
        version: this.userStore.customerData.body.version,
        actions: [
          this.newEmailData,
          this.newFirstNameData,
          this.newLastNameData,
          this.newDateOfBirthData,
        ],
      };
    },
    allFieldsValid(): boolean {
      const checkingFields = this.fields.filter((elem) => elem.value !== '');
      return checkingFields.every((elem) => elem.valid === 'valid');
    },
    fieldFilled(): boolean {
      return this.fields.some((elem) => elem.value !== '');
    },
  },
  components: {
    BaseInput,
    BaseMessage,
    BaseButton,
  },
  // eslint-disable-next-line max-lines-per-function
  data(): {
    mainFields: MainFields;
    fields: RegistrationMainData[];
    placeholders: string[];
    } {
    return {
      mainFields: {} as MainFields,
      fields: [
        {
          label: 'First Name',
          pattern: /^[a-zA-Z]+$/,
          placeholder: 'firstName',
          invalidMessage: InvalidMessage.FirstName,
          showMessage: false,
          value: '',
        },
        {
          label: 'Last Name',
          pattern: /^[a-zA-Z]+$/,
          placeholder: 'lastName',
          invalidMessage: InvalidMessage.LastName,
          showMessage: false,
          value: '',
        },
        {
          label: 'Date of birth',
          placeholder: 'dateOfBirth',
          type: 'date',
          invalidMessage: InvalidMessage.Date,
          showMessage: false,
          value: '',
          dateValue: '2000-01-02',
        },
        {
          label: 'Email',
          pattern:
            /^((?:[A-Za-z0-9!#$%&'*+\-\\/=?^_`{|}~]|(?:=^|\.)"|"(?=$|\.|@)|(?:=".*)[ .](?=.*")|(?:!\.)\.){1,64})(@)((?:[A-Za-z0-9.\\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/,
          placeholder: 'email',
          type: 'text',
          invalidMessage: InvalidMessage.Email,
          showMessage: false,
          value: '',
        },
      ],
      placeholders: [
        'name',
        'last name',
        'date of birth',
        'email',
      ],
    };
  },
  methods: {
    handleInput(event: Event, index: number): void {
      this.setValue(event, index);
      this.checkValid(index);
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
    nextStep(): void {
      this.$emit('valid-all-main-fields', { ...this.mainFields, nextStepClick: true });
    },
    getPlaceholder(dataName: string | undefined): string {
      return this.userStore.customerData.body[dataName ?? ''];
    },
    async updateInfo(): Promise<void> {
      if (!this.allFieldsValid) return;
      if (this.fieldFilled) {
        try {
          await api.call().me().post({ body: this.postData }).execute();
          await this.userStore.getData();
          this.$emit('close');
          this.$emit('showSuccessMessage');
        } catch (error) {
          console.error('Error:', error);
        }
      }
    },
  },
};
</script>

<style scoped>
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
