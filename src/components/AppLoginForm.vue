<template>
  <div class="login-form">
    <h1 class="title">
      Login to Crunch
    </h1>
    <BaseInput
      id="emailInput"
      ref="emailInput"
      type="text"
      name="email"
      :valid="emailValue"
      class="custom-input-style"
      @input="emailValidation"
      @change="emailValidation"
      @keydown.enter="blurInput" />
    <Transition>
      <BaseMessage
        v-if="emailValue === 'invalid'"
        alert="danger"
        :text="emailMessageText" />
    </Transition>
    <BaseInput
      id="passInput"
      ref="passInput"
      :type="passInputType"
      name="password"
      :hidePass="hidePass"
      :valid="passValue"
      @input="passwordValidation"
      @change="passwordValidation"
      @click="showPassword"
      @keydown.enter="blurInput" />
    <Transition>
      <BaseMessage
        v-if="passValue === 'invalid'"
        alert="danger"
        :text="passMessageText" />
    </Transition>
    <BaseButton
      label="Sign in"
      size="medium"
      @click="signIn" />
    <p>
      Don't have an account yet?
      <router-link
        class="register-link"
        :to="{ name: registration }">
        Sign up
      </router-link>
    </p>
    <Transition>
      <BaseMessage
        v-if="wrongData"
        alert="danger"
        :text="wrongDataText"
        title="Ooops!" />
    </Transition>
  </div>
</template>

<script lang="ts">
import type { UserAuthOptions } from '@commercetools/sdk-client-v2';
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
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
    ...mapStores(useUserStore),
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
        ats.length > 1 ||
        domain.length < 2 ||
        domain.search(/[!#$%^&*()-_=+'"`~?><,.|;:±§]/) !== -1
      ) {
        return false;
      }
      const textStr = /^[A-Za-z0-9\-._]+@[A-Za-z0-9]{2,}\.[A-Za-z]{2}/iu;
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
      if (this.whiteSpacesCheck(val) && this.correctEmailAddressCheck(val)) {
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
        this.passValue === '' ||
        this.passValue === 'invalid' ||
        this.emailValue === '' ||
        this.emailValue === 'invalid'
      ) {
        return;
      }
      const data = this.dataForSignIn;
      const response = await Api.signInCustomer(data);
      if (response.ok && response.data) {
        this.userStore.loginUser(response.data);
        this.$router.push(PathPages.Home);
        return;
      }
      if (response.message) {
        this.wrongDataText = response.message;
      }
      this.wrongData = true;
    },
    blurInput(event: KeyboardEvent): void {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        event.target.blur();
        this.signIn();
      }
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
  margin: 6% auto;
  width: 420px;
  padding: 1rem 3rem 2rem 3rem;
  gap: 19px;
  box-sizing: content-box;
}
.input-block {
  width: 100%;
  padding: 0;
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
@media (max-width: 550px) {
  .login-form {
    width: 90%;
    padding: 1rem 0 2rem 0;
  }
}
</style>
