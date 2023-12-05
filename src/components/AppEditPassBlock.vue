<template>
  <div class="container">
    <div
      class="edit-form"
      @keydown.enter="nextStep()">
      <div
        v-for="(field, i) in fields"
        :key="i"
        class="field-container">
        <BaseInput
          :id="field.label.toLowerCase()"
          :label="field.label"
          :hidePass="field.placeholder === 'password' ? field.hidePass : ''"
          :name="field.placeholder"
          :valid="field.valid"
          :value="field.value"
          :type="field.type"
          @click="showPassword($event, i)"
          @input="handleInput($event, i)"
          @focusin="
            field.showMessage = true;
            notMatch = false;
            wrongOldPass = false;
          "
          @focusout="field.showMessage = false" />
        <Transition>
          <BaseMessage
            v-if="field.showMessage && field.valid === 'invalid'"
            absolute
            arrow="top"
            alert="danger">
            {{ field.invalidMessage }}
          </BaseMessage>
        </Transition>
      </div>
    </div>
    <Transition>
      <BaseMessage
        v-if="notMatch === true"
        absolute
        arrow="top"
        alert="danger">
        {{ notMatchText }}
      </BaseMessage>
    </Transition>
    <BaseButton
      class="btn-update"
      @click="updateInfo">
      Update
    </BaseButton>
    <Transition>
      <BaseMessage
        v-if="wrongOldPass === true"
        alert="danger">
        {{ wrongOldPassText }}
      </BaseMessage>
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
import type { MainFields, PasswordEditBlock } from '@/types/types';
import BaseButton from './shared/BaseButton.vue';

export default {
  components: {
    BaseInput,
    BaseMessage,
    BaseButton,
  },
  emits: ['valid-all-main-fields', 'close', 'showSuccessMessage'],
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
  methods: {
    handleInput(event: Event, index: number): void {
      this.setValue(event, index);
      this.checkValid(index);
    },
    setValue(event: Event, index: number): void {
      const input = event.target as HTMLInputElement;
      const field = this.fields[index];
      field.value = input.value.trim();
    },
    checkValid(i: number): void {
      const field = this.fields[i];

      if (field.value === '') field.valid = '';

      if (field.value && field.pattern) {
        field.valid = field.pattern.test(field.value) ? 'valid' : 'invalid';
      }
    },
    showPassword(event: InputEvent, index: number): void {
      const input = event.target as HTMLInputElement;
      const field = this.fields[index];
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
          const resp = await api.signInCustomer({
            username: email,
            password: this.newPass,
          });
          if (resp.data) this.userStore.loginUser(resp.data);
          this.$emit('close');
          this.$emit('showSuccessMessage');
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
@media (max-width: 768px) {
  .container {
    margin-top: 30px;
  }
}
</style>
