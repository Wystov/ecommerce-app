<template>
  <form
    class="registration-form"
    @keydown.enter="!showMessageSignIn && registrationUser()">
    <RegistrationMain @validAllMainFields="checkMainFields" />
    <Transition>
      <div
        v-if="showAddressBlock"
        class="address shipping">
        <hr />
        <RegistrationAddress
          id="shipping"
          title="Shipping address"
          @validAllAddressFields="checkAddressFields" />
      </div>
    </Transition>
    <Transition>
      <div
        v-if="showAddressBlock && !onlyShipping"
        class="address billing">
        <RegistrationAddress
          id="billing"
          title="Billing address"
          @validAllAddressFields="checkAddressFields" />
      </div>
    </Transition>
    <Transition>
      <div
        v-if="showAddressBlock"
        class="checkboxes">
        <BaseCheckbox
          id="check-def-shipping"
          name="def-shipping"
          label="Set default shipping address"
          :checked="defaultAddresses.defaultShipping"
          @change="() => (defaultAddresses.defaultShipping = !defaultAddresses.defaultShipping)" />
        <BaseCheckbox
          id="check-def-billing"
          name="def-billing"
          label="Set default billing address"
          :checked="defaultAddresses.defaultBilling"
          @change="() => (defaultAddresses.defaultBilling = !defaultAddresses.defaultBilling)" />
        <BaseCheckbox
          id="check-only-shipping"
          name="only-shipping"
          label="Use the shipping address as the billing address"
          :checked="onlyShipping"
          @change="toggleOnlyShipping" />
      </div>
    </Transition>
    <Transition>
      <BaseMessage
        v-if="showMessageInvalid"
        alert="warning">
        {{ invalidMessage }}
      </BaseMessage>
    </Transition>
    <Transition>
      <BaseButton
        v-if="showAddressBlock"
        class="btn-create-account"
        @click="registrationUser">
        Create account
      </BaseButton>
    </Transition>
    <p class="footnote">
      Already have an account?
      <router-link
        class="login-link"
        :to="{ name: LOGIN }">
        Log in
      </router-link>
    </p>
  </form>
  <Transition>
    <div
      v-if="showMessageSignIn"
      class="success-message-container">
      <div
        v-if="loading"
        class="spinner" />
      <Transition>
        <BaseMessage
          v-if="createCustomerMessage.show"
          rounded
          class="success-base-message"
          :title="createCustomerMessage.title"
          :alert="createCustomerMessage.alert">
          <p class="success-message">
            {{ createCustomerMessage.text }}
          </p>
        </BaseMessage>
      </Transition>
    </div>
  </Transition>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import RegistrationMain from '@/components/RegistrationMain.vue';
import RegistrationAddress from '@/components/RegistrationAddress.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCheckbox from '@/components/shared/BaseCheckbox.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import api from '@/utils/api/client';
import { NamePages, PathPages } from '@/types/enums';
import type { UserSignUp, UserAddress, DefaultAddressProps, UserSignUpMain } from '../types/types';

export default {
  components: {
    RegistrationMain,
    RegistrationAddress,
    BaseButton,
    BaseCheckbox,
    BaseMessage,
  },
  data(): {
    LOGIN: string;
    showAddressBlock: boolean;
    onlyShipping: boolean;
    bodyMain: UserSignUpMain;
    bodyAddresses: Array<UserAddress>;
    bodyRequest: UserSignUp;
    defaultAddresses: DefaultAddressProps;
    showMessageInvalid: boolean;
    invalidMessage: string;
    showMessageSignIn: boolean;
    loading: boolean;
    createCustomerMessage: { text: string; alert: string; title: string; show: boolean };
    } {
    return {
      LOGIN: NamePages.Login,
      showAddressBlock: false,
      onlyShipping: true,
      bodyMain: {} as UserSignUpMain,
      bodyAddresses: [{}, {}] as UserAddress[],
      bodyRequest: {} as UserSignUp,
      defaultAddresses: {
        defaultShipping: true,
        defaultBilling: true,
      },
      showMessageInvalid: false,
      invalidMessage: 'Please fill in all fields correctly',
      showMessageSignIn: false,
      loading: false,
      createCustomerMessage: {
        text: '',
        alert: 'success',
        title: '',
        show: false,
      },
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    toggleOnlyShipping(): void {
      this.showMessageInvalid = false;
      this.onlyShipping = !this.onlyShipping;
    },

    checkMainFields(data: {
      valid: boolean;
      response: UserSignUpMain;
      nextStepClick: boolean;
    }): void {
      const { valid, response, nextStepClick } = data;
      this.showMessageInvalid = false;
      if (nextStepClick && valid) this.showAddressBlock = true;
      if (nextStepClick && !valid) this.showMessageInvalid = true;
      this.bodyMain = response;
    },

    checkAddressFields(data: {
      valid: boolean;
      response: { fields: UserAddress; name: string };
    }): void {
      const {
        response: { name, fields },
      } = data;
      const { bodyAddresses } = this;
      this.showMessageInvalid = false;

      if (name === 'shipping') bodyAddresses[0] = fields;
      if (name === 'billing') bodyAddresses[1] = fields;
    },

    async registrationUser(): Promise<void> {
      const { bodyMain, bodyAddresses, onlyShipping } = this;
      if (bodyMain) {
        this.bodyRequest = {
          ...bodyMain,
          addresses: bodyAddresses,
        };
      }
      if (onlyShipping) {
        this.bodyAddresses[1] = { ...this.bodyAddresses[0] };
      }
      if ('email' in this.bodyRequest && bodyAddresses.every((address) => 'city' in address)) {
        this.showMessageInvalid = false;
        this.showMessageSignIn = true;
        this.loading = true;
        window.scrollTo(2000, 0);
        document.body.style.overflow = 'hidden';
        await this.createCustomer();
      } else {
        this.showMessageInvalid = true;
      }
    },

    async createCustomer(): Promise<void> {
      const createCustomer = await api.createCustomer(this.bodyRequest, this.defaultAddresses);
      if (createCustomer.ok) {
        await this.signInUser();
        this.loading = false;
        this.createCustomerMessage.show = true;
        this.createCustomerMessage.title = 'Registration completed successfully!';
        this.createCustomerMessage.text = 'Redirect to home page after a few seconds...';
        setTimeout(() => {
          document.body.style.overflow = '';
          this.$router.push(PathPages.Home);
        }, 4000);
      } else {
        this.loading = false;
        this.createCustomerMessage.show = true;
        this.createCustomerMessage.title = 'Registration was not successful';
        this.createCustomerMessage.alert = 'danger';
        this.createCustomerMessage.text = `Oops... ${createCustomer.message}`;
      }
    },

    async signInUser(): Promise<void> {
      const { email, password } = this.bodyRequest;
      await api.signInCustomer({ username: email, password });
      this.userStore.loginUser();
    },
  },
};
</script>
<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  gap: 34px;
}
.address {
  display: flex;
  flex-direction: column;
  gap: 34px;
}
.checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.btn-create-account {
  width: max-content;
}
.login-link {
  color: var(--main-color);
}
.loading {
  display: flex;
  justify-content: center;
}
.success-message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  backdrop-filter: blur(4px);
  z-index: 1;
  box-sizing: border-box;
}
.success-base-message {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px 40px;
}
.success-message {
  font-size: 22px;
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
