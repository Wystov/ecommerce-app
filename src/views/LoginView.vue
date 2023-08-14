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
    <BaseMessage v-if="emailMessageShown" alert="danger" :text="emailMessageText" />
    <BaseInput
      :type="passInputType"
      name="Password..."
      id="passInput"
      @input="passwordValidation"
      :valid="passValue"
      ref="passInput"
    />
    <BaseCheckbox label="Show password" id="show" name="show-password" @change="showPassword" />
    <BaseMessage v-if="passMessageShown" alert="danger" :text="passMessageText" />
    <BaseButton label="Sign in" size="medium" />
    <p class="footnote">
      Don't have an account yet?
      <router-link class="register-link" :to="{ name: 'Registration' }"> Sign up </router-link>
    </p>
  </div>
</template>

<script lang="ts">
import '@/assets/styles/style.css';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseCheckbox from '@/components/shared/BaseCheckbox.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import { type InputComponent, type DataLogin } from '@/types/types';
import { InvalidMessage } from '@/types/enums';

export default {
  components: {
    BaseInput,
    BaseCheckbox,
    BaseButton,
    BaseMessage,
  },
  data(): DataLogin {
    return {
      emailValue: '',
      passValue: '',
      passInputType: 'password',
      emailMessageShown: false,
      passMessageShown: false,
      emailMessageText: InvalidMessage.Email,
      passMessageText: InvalidMessage.Password,
    };
  },
  computed: {
    formatEmail(value: string): string {
      return value.toLowerCase();
    },
  },
  methods: {
    whiteSpacesCheck(value: string): boolean {
      return !value.includes(' ');
    },
    correctEmailAddressCheck(value: string): boolean {
      const ats = value.split('').filter((el) => el === '@');
      if (ats.length > 1) {
        return false;
      }
      const textStr = /[A-Za-z0-9\-._]+@[A-Za-z0-9]{2,}\.[A-Za-z]{2}/iu;
      return textStr.test(value);
    },
    emailValidation(): void {
      const comp = this.$refs.emailInput as InputComponent;
      const val: string = comp.inputValue;
      if (val.length !== 0) {
        if (this.correctEmailAddressCheck(val) && this.whiteSpacesCheck(val)) {
          this.emailValue = 'valid';
          this.emailMessageShown = false;
        } else {
          this.emailValue = 'invalid';
          this.emailMessageShown = true;
        }
      } else {
        this.emailValue = '';
        this.emailMessageShown = false;
      }
    },
    lengthCheck(value: string): boolean {
      const correctLength = 8;
      return value.length >= correctLength;
    },
    correctPasswordCheck(value: string): boolean {
      const textStr = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/u;
      return textStr.test(value);
    },
    passwordValidation(): void {
      const comp = this.$refs.passInput as InputComponent;
      const val: string = comp.inputValue;
      if (val.length !== 0) {
        if (this.lengthCheck(val) && this.whiteSpacesCheck(val) && this.correctPasswordCheck(val)) {
          this.passValue = 'valid';
          this.passMessageShown = false;
        } else {
          this.passValue = 'invalid';
          this.passMessageShown = true;
        }
      } else {
        this.passValue = '';
        this.passMessageShown = false;
      }
    },
    showPassword(event: InputEvent): void {
      if (event.target instanceof HTMLInputElement) {
        this.passInputType = event.target.checked ? 'text' : 'password';
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
