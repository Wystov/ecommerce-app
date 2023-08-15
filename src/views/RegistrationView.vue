<template>
  <section class="container">
    <form>
      <h1>Registration</h1>
      <RegistrationMain @valid-all-main-fields="openAddressBlock" />
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
            @change="() => (defaultAddress.shipping = !defaultAddress.shipping)"
          />
          <BaseCheckbox
            id="check-only-shipping"
            name="only-shipping"
            label="Use the shipping address as the billing address"
            @change="() => (hideBilling = !hideBilling)"
          />
        </div>
      </Transition>
      <Transition>
        <div class="billing" v-if="showAddressBlock && !hideBilling">
          <RegistrationAddress
            title="Billing address"
            id="billing"
            @valid-all-address-fields="checkAddressFields"
          />
          <BaseCheckbox
            id="check-def-billing"
            name="def-billing"
            label="Set default billing address"
            @change="() => (defaultAddress.billing = !defaultAddress.billing)"
          />
        </div>
      </Transition>
      <Transition>
        <BaseButton
          v-if="showAddressBlock"
          @click="registrationUser"
          size="large"
        >Submit</BaseButton
        >
      </Transition>
    </form>
  </section>
</template>
-
<script lang="ts">
import RegistrationMain from '@/components/RegistrationMain.vue';
import RegistrationAddress from '@/components/RegistrationAddress.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import BaseCheckbox from '@/components/shared/BaseCheckbox.vue';

export default {
  components: {
    RegistrationMain,
    RegistrationAddress,
    BaseButton,
    BaseCheckbox,
  },
  data(): {
    showAddressBlock: Boolean;
    hideBilling: Boolean;
    bodyMain: {} | null;
    bodyAddresses: Array<{}>;
    bodyRequest: {};
    defaultAddress: {
      shipping: Boolean;
      billing: Boolean;
    };
    } {
    return {
      showAddressBlock: true,
      hideBilling: false,
      bodyMain: {},
      bodyAddresses: [],
      bodyRequest: {},
      defaultAddress: {
        shipping: false,
        billing: false,
      },
    };
  },
  methods: {
    openAddressBlock(data: {}): void {
      if (data) this.showAddressBlock = true;
      this.bodyMain = data;
    },
    checkAddressFields(data: { fields: {}; name: string } | null): void {
      if (data) {
        if (data.name === 'shipping') this.bodyAddresses[0] = data.fields;
        if (data.name === 'billing') {
          this.bodyAddresses[1] = this.hideBilling ? this.bodyAddresses[0] : data.fields;
        }
      }
    },
    registrationUser(): void {
      const { bodyMain, bodyAddresses, defaultAddress } = this;
      if (bodyMain) {
        this.bodyRequest = {
          ...bodyMain,
          addresses: bodyAddresses,
        };
      }
      const { shipping, billing } = defaultAddress;
      const defaultAddresses = {
        defaultShipping: shipping,
        defaultBilling: billing,
      };
      console.log(this.bodyRequest, defaultAddresses);
    },
  },
};
</script>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
