<template>
  <div class="login-form">
    <h1 class="main-header">Login to Crunch</h1>
    <BaseInput
      type="email"
      name="email"
      id="emailInput"
      @input="emailValidation"
      :valid="emailValue"
      class="custom-input-style"
      ref="emailInput"
    />
    <BaseMessage v-if="emailValue === 'invalid'" alert="danger" :text="emailMessageText" />
    <BaseInput
      :type="passInputType"
      name="password"
      id="passInput"
      :hidePass="hidePass"
      @input="passwordValidation"
      @click="showPassword"
      :valid="passValue"
      ref="passInput"
    />
    <BaseMessage v-if="passValue === 'invalid'" alert="danger" :text="passMessageText" />
    <BaseButton label="Sign in" size="medium" @click="signIn" />
    <p>
      Don't have an account yet?
      <router-link class="register-link" :to="{ name: registration }"> Sign up </router-link>
    </p>
    <BaseMessage v-if="wrongData" alert="danger" :text="wrongDataText" title="Ooops!" />
  </div>
</template>

<script lang="ts">
import type { UserAuthOptions } from '@commercetools/sdk-client-v2';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import type { DataLogin, BaseInputType } from '@/types/types';
import { NamePages, InvalidMessage, PathPages } from '@/types/enums';
import Api from '@/utils/api/client';

export default {
  components: {
    BaseInput,
    BaseButton,
    BaseMessage,
  },
  data(): DataLogin {
    return {
      emailValue: '',
      passValue: '',
      passInputType: 'password',
      hidePass: 'show',
      emailMessageText: InvalidMessage.Email,
      passMessageText: InvalidMessage.Password,
      wrongData: false,
      wrongDataText: '',
      registration: NamePages.Registration,
    };
  },
  computed: {
    dataForSignIn(): UserAuthOptions {
      const email = this.$refs.emailInput as BaseInputType;
      const pass = this.$refs.passInput as BaseInputType;
      return {
        username: email.inputValue.toLowerCase(),
        password: pass.inputValue,
      };
    },
  },
  methods: {
    whiteSpacesCheck(value: string): boolean {
      return !value.includes(' ');
    },
    correctEmailAddressCheck(value: string): boolean {
      const ats = value.split('').filter((el) => el === '@');
      const domainArr = value.split('.');
      const domain = domainArr[domainArr.length - 1];
      if (
        ats.length > 1
        || domain.length < 2
        || domain.search(/[!#$%^&*()-_=+'"`~?><,.|;:±§]/) !== -1
      ) {
        return false;
      }
      const textStr = /[A-Za-z0-9\-._]+@[A-Za-z0-9]{2,}\.[A-Za-z]{2}/iu;
      return textStr.test(value);
    },
    emailValidation(event: InputEvent): void {
      this.wrongData = false;
      const comp = event.target as HTMLInputElement;
      const val: string = comp.value;
      if (!val.length) {
        this.emailValue = '';
        return;
      }
      if (this.correctEmailAddressCheck(val) && this.whiteSpacesCheck(val)) {
        this.emailValue = 'valid';
      } else {
        this.emailValue = 'invalid';
      }
    },
    correctPasswordCheck(value: string): boolean {
      const textStr = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
      return textStr.test(value);
    },
    passwordValidation(event: InputEvent): void {
      this.wrongData = false;
      const comp = event.target as HTMLInputElement;
      const val: string = comp.value;
      if (!val.length) {
        this.passValue = '';
        return;
      }
      if (this.whiteSpacesCheck(val) && this.correctPasswordCheck(val)) {
        this.passValue = 'valid';
      } else {
        this.passValue = 'invalid';
      }
    },
    showPassword(event: InputEvent): void {
      if (!event.target) {
        return;
      }
      const { target } = event;
      if (!(target instanceof SVGElement)) {
        return;
      }
      if (this.hidePass === 'show') {
        this.hidePass = 'hide';
        this.passInputType = 'text';
        return;
      }
      this.hidePass = 'show';
      this.passInputType = 'password';
    },
    async signIn(): Promise<void> {
      if (
        this.passValue === ''
        || this.passValue === 'invalid'
        || this.emailValue === ''
        || this.emailValue === 'invalid'
      ) {
        return;
      }
      const data = this.dataForSignIn;
      const response = await Api.signInCustomer(data);
      if (response.ok) {
        this.$router.push(PathPages.Home);
        return;
      }
      if (response.message) {
        this.wrongDataText = response.message;
      }
      this.wrongData = true;
    },
  },
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--main-font-style);
  color: var(--main-font-color);
  margin: 10% auto auto;
  width: 420px;
  padding: 1rem 3rem 2rem 3rem;
  gap: 19px;
}

.input-block {
  width: 100%;
  padding: 0;
}

.login-form :deep(.input-icon) {
  cursor: pointer;
}

.button {
  width: 100%;
  height: 3rem;
  border-radius: 10px;
  margin: 0.8rem 0;
}

.checkbox-block {
  align-self: flex-start;
}

.register-link {
  color: var(--main-color);
  cursor: pointer;
}
</style>
