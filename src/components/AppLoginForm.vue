<template>
  <div class="login-form">
    <h1 class="login-header">Login</h1>
    <BaseInput
      type="email"
      name="Email..."
      id="emailInput"
      @input="emailValidation"
      :valid="emailValue"
      ref="emailInput"
    />
    <BaseMessage v-if="emailValue === 'invalid'" alert="danger" :text="emailMessageText" />
    <BaseInput
      :type="passInputType"
      name="Password..."
      id="passInput"
      :hidePass="hidePass"
      @input="passwordValidation"
      @click="showPassword"
      :valid="passValue"
      ref="passInput"
    />
    <BaseMessage v-if="passValue === 'invalid'" alert="danger" :text="passMessageText" />
    <BaseButton label="Sign in" size="medium" @click="signIn" />
    <p class="footnote">
      Don't have an account yet?
      <router-link class="register-link" :to="{ name: 'Registration' }"> Sign up </router-link>
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
import { InvalidMessage } from '@/types/enums';
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
    };
  },
  computed: {
    dataForSignIn(): UserAuthOptions {
      const email = this.$refs.emailInput as BaseInputType;
      const pass = this.$refs.passInput as BaseInputType;
      return {
        username: email.inputValue.toLocaleLowerCase(),
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
        this.$router.push('/');
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
  margin: 5% auto auto;
  width: 40%;
  border-radius: 7px;
  background-color: #fcebfb;
  padding: 2rem 3rem 2rem 3rem;
  gap: 15px;
}

.login-header {
  margin: 0 0 0.5rem;
}

.input-block {
  width: 100%;
  padding: 0;
}

.checkbox-block {
  align-self: flex-start;
}

.footnote {
  margin: 0;
}

.register-link {
  text-decoration: none;
  color: var(--main-purple);
  cursor: pointer;
}
</style>
