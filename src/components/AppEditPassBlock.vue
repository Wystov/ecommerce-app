<template>
  <div class="container">
    <div class="edit-form" @keydown.enter="nextStep()">
      <div class="field-container" v-for="(field, i) in fields" :key="i">
        <BaseInput
          :label="field.label"
          :hidePass="field.placeholder === 'password' ? field.hidePass : ''"
          @click="showPassword($event, i)"
          :name="field.placeholder"
          @input="handleInput($event, i)"
          :valid="field.valid"
          :value="field.value"
          :type="field.type"
          :id="field.label.toLowerCase()"
          @focusin="field.showMessage = true; notMatch = false; wrongOldPass = false"
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
    <Transition>
      <BaseMessage
        absolute
        arrow="top"
        v-if="notMatch === true"
        alert="danger"
      >{{ notMatchText }}</BaseMessage
      >
    </Transition>
    <BaseButton @click="updateInfo" class="btn-update">Update</BaseButton>
    <Transition>
      <BaseMessage
        v-if="wrongOldPass === true"
        alert="danger"
      >{{ wrongOldPassText }}</BaseMessage
      >
    </Transition>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import type { MyCustomerChangePassword } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import api from '@/utils/api/client';
import { useUserStore } from '@/stores/user';
import { InvalidMessage } from '@/types/enums';
import type { RegistrationMainData, MainFields, PasswordEditBlock } from '@/types/types';
import BaseButton from './shared/BaseButton.vue';

export default {
  emits: ['valid-all-main-fields', 'close'],
  computed: {
    ...mapStores(useUserStore),
    currentPass(): string {
      return this.fields[0].value ?? '';
    },
    newPass(): string {
      return this.fields[1].value ?? '';
    },
    postNewData(): MyCustomerChangePassword {
      return {
        version: this.userStore.customerData.body.version,
        currentPassword: this.currentPass,
        newPassword: this.newPass,
      };
    },
    invalidFields(): boolean {
      return this.fields.every((elem) => elem.valid === 'valid');
    },
    fieldsNotComplete(): boolean {
      return this.fields.every((elem) => elem.value !== '');
    },
    readyToUpdate(): boolean {
      return this.fields[1].value === this.fields[2].value;
    },
  },
  components: {
    BaseInput,
    BaseMessage,
    BaseButton,
  },
  // eslint-disable-next-line max-lines-per-function
  data(): PasswordEditBlock {
    return {
      mainFields: {} as MainFields,
      fields: [
        {
          label: 'Old password',
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          placeholder: 'password',
          type: 'password',
          invalidMessage: InvalidMessage.Password,
          showMessage: false,
          value: '',
          hidePass: 'show',
        },
        {
          label: 'New password',
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          placeholder: 'password',
          type: 'password',
          invalidMessage: InvalidMessage.Password,
          showMessage: false,
          value: '',
          hidePass: 'show',
        },
        {
          label: 'Confirm new password',
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          placeholder: 'password',
          type: 'password',
          invalidMessage: InvalidMessage.Password,
          showMessage: false,
          value: '',
          hidePass: 'show',
        },
      ],
      notMatch: false,
      notMatchText: InvalidMessage.NotMatch,
      wrongOldPass: false,
      wrongOldPassText: InvalidMessage.WrongPassword,
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
    },
    showPassword(e: InputEvent, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];
      if (!(input instanceof SVGElement)) {
        return;
      }
      if (field.hidePass === 'show') {
        field.hidePass = 'hide';
        field.type = 'text';
        return;
      }
      field.hidePass = 'show';
      field.type = 'password';
    },
    nextStep(): void {
      this.$emit('valid-all-main-fields', { ...this.mainFields, nextStepClick: true });
    },
    async updateInfo(): Promise<void> {
      if (!this.invalidFields) return;
      if (!this.fieldsNotComplete) return;
      if (!this.readyToUpdate) {
        this.notMatch = true;
      }
      if (this.readyToUpdate) {
        try {
          const { email } = this.userStore.customerData.body;
          await api.call().me().password().post({ body: this.postNewData }).execute();
          await api.signInCustomer({
            username: email,
            password: this.newPass,
          });
          this.userStore.loginUser();
          this.$emit('close');
        } catch (error) {
          this.wrongOldPass = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.container :deep(.message-field) {
  margin: 20px 0 0 0;
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
@media(max-width: 768px) {
  .container {
    margin-top: 30px;
  }
}
</style>
