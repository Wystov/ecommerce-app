<template>
  <form v-if="!showSuccessMessage" class="registration-form">
    <RegistrationMain @valid-all-main-fields="checkMainFields" />
    <Transition>
      <div class="address shipping" v-if="showAddressBlock">
        <hr />
        <RegistrationAddress
          title="Shipping address"
          id="shipping"
          @valid-all-address-fields="checkAddressFields"
        />
      </div>
    </Transition>
    <Transition>
      <div class="address billing" v-if="showAddressBlock && !onlyShipping">
        <RegistrationAddress
          title="Billing address"
          id="billing"
          @valid-all-address-fields="checkAddressFields"
        />
      </div>
    </Transition>
    <Transition>
      <div class="checkboxes" v-if="showAddressBlock">
        <BaseCheckbox
          id="check-def-shipping"
          name="def-shipping"
          label="Set default shipping address"
          @change="() => (defaultAddresses.defaultShipping = !defaultAddresses.defaultShipping)"
          :checked="defaultAddresses.defaultShipping"
        />
        <BaseCheckbox
          id="check-def-billing"
          name="def-billing"
          label="Set default billing address"
          @change="() => (defaultAddresses.defaultBilling = !defaultAddresses.defaultBilling)"
          :checked="defaultAddresses.defaultBilling"
        />
        <BaseCheckbox
          id="check-only-shipping"
          name="only-shipping"
          label="Use the shipping address as the billing address"
          @change="toggleOnlyShipping"
          :checked="onlyShipping"
        />
      </div>
    </Transition>
    <Transition>
      <BaseMessage alert="warning" v-if="showMessage">
        {{ invalidMessage }}
      </BaseMessage>
    </Transition>
    <Transition>
      <BaseButton
        class="btn-create-account"
        v-if="showAddressBlock"
        @click="registrationUser"
      >Create account</BaseButton
      >
    </Transition>
    <p class="footnote">
      Already have an account?
      <router-link class="login-link" :to="{ name: LOGIN }"> Log in </router-link>
    </p>
  </form>
  <BaseMessage
    class="success-message-container"
    v-if="showSuccessMessage"
    :alert="createCustomerMessage.alert"
  ><div v-if="loading" class="spinner" />
    <p class="success-message">{{ createCustomerMessage.text }}</p>
  </BaseMessage>
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
import type {
  UserSignUp, UserAddress, DefaultAddressProps, UserSignUpMain,
} from '../types/types';

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
    showMessage: boolean;
    invalidMessage: string;
    showSuccessMessage: boolean;
    loading: boolean;
    createCustomerMessage: { text: string; alert: string };
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
      showMessage: false,
      invalidMessage: 'Please fill in all fields correctly',
      showSuccessMessage: false,
      loading: false,
      createCustomerMessage: { text: '', alert: 'success' },
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    toggleOnlyShipping(): void {
      this.showMessage = false;
      this.onlyShipping = !this.onlyShipping;
    },

    checkMainFields(data: {
      valid: boolean;
      response: UserSignUpMain;
      nextStepClick: boolean;
    }): void {
      const { valid, response, nextStepClick } = data;
      this.showMessage = false;
      if (nextStepClick && valid) this.showAddressBlock = true;
      if (nextStepClick && !valid) this.showMessage = true;
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
      this.showMessage = false;

      if (name === 'shipping') bodyAddresses[0] = fields;
      if (name === 'billing') bodyAddresses[1] = fields;
    },

    async registrationUser(): Promise<void> {
      this.showSuccessMessage = true;
      this.loading = true;
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
        await this.createCustomer();
      } else {
        this.showMessage = true;
      }
    },

    async createCustomer(): Promise<void> {
      this.showMessage = false;
      const createCustomer = await api.createCustomer(this.bodyRequest, this.defaultAddresses);
      if (createCustomer.ok) {
        await this.signInUser();
        this.loading = false;
        this.createCustomerMessage.text = `Registration completed successfully!
         Redirect to home page after a few seconds...`;
        setTimeout(() => {
          this.$router.push(PathPages.Home);
        }, 4000);
      } else {
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
  min-width: 280px;
  margin: 0 auto;
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
