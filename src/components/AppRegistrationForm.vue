<template>
  <form class="registration-form">
    <RegistrationMain @valid-all-main-fields="checkMainFields" />
    <Transition>
      <div class="shipping" v-if="showAddressBlock">
        <RegistrationAddress
          title="Shipping address"
          id="shipping"
          @valid-all-address-fields="checkAddressFields"
        />
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
      <div class="billing" v-if="showAddressBlock && !onlyShipping">
        <RegistrationAddress
          title="Billing address"
          id="billing"
          @valid-all-address-fields="checkAddressFields"
        />
      </div>
    </Transition>
    <Transition>
      <BaseMessage alert="warning" v-if="showMessage">
        {{ invalidMessage }}
      </BaseMessage>
    </Transition>
    <Transition>
      <BaseButton v-if="showAddressBlock" @click="registrationUser" size="large">Submit</BaseButton>
    </Transition>
  </form>
</template>

<script lang="ts">
import RegistrationMain from '@/components/RegistrationMain.vue';
import RegistrationAddress from '@/components/RegistrationAddress.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCheckbox from '@/components/shared/BaseCheckbox.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import api from '@/utils/api/client';
import { NamePages } from '@/types/enums';
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
    showAddressBlock: boolean;
    onlyShipping: boolean;
    bodyMain: UserSignUpMain;
    bodyAddresses: Array<UserAddress>;
    bodyRequest: UserSignUp;
    defaultAddresses: DefaultAddressProps;
    showMessage: boolean;
    invalidMessage: string;
    } {
    return {
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
    };
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
    registrationUser(): void {
      const {
        bodyMain, bodyAddresses, defaultAddresses, onlyShipping,
      } = this;
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
        this.showMessage = false;
        api.createCustomer(this.bodyRequest, defaultAddresses);
        this.$router.push({ name: NamePages.Home });
      } else {
        this.showMessage = true;
      }
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
