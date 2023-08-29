<template>
  <div class="info-container">
    <h4>Shipping addresses</h4>
    <div class="address-block">
      <div v-if="defaultShippingId.length !== 0" class="address-item">
        <div class="default">Default</div>
        <div class="address-line">
          <span>{{ getDefaultShippingAddress }}</span>
          <PencilSquareIcon class="icon" />
          <ArchiveBoxXMarkIcon class="icon" />
        </div>
      </div>
      <template v-for="(address, i) in getShippingAddresses" :key="i">
        <div class="address-item">
          <div v-if="defaultShippingId.length !== 0" class="divider" />
          <div class="address-line">
            <span>{{ address.streetName + ', ' + address.city + ', ' + address.country + ', ' + address.postalCode }}</span>
            <PencilSquareIcon class="icon" />
            <ArchiveBoxXMarkIcon class="icon" />
            <div v-if="true" class="default set-default">Set as default</div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div class="info-container">
    <h4>Billing addresses</h4>
    <div class="address-block">
      <div v-if="defaultBillingId.length !== 0" class="address-item">
        <div class="default">Default</div>
        <div class="address-line">
          <span>{{ getDefaultBillingAddress }}</span>
          <PencilSquareIcon class="icon" />
          <ArchiveBoxXMarkIcon class="icon" />
        </div>
      </div>
      <template v-for="(address, i) in getBillingAddresses" :key="i">
        <div class="address-item">
          <div v-if="defaultBillingId.length !== 0" class="divider" />
          <div class="address-line">
            <span>{{ address.streetName + ', ' + address.city + ', ' + address.country + ', ' + address.postalCode }}</span>
            <PencilSquareIcon class="icon" />
            <ArchiveBoxXMarkIcon class="icon" />
            <div v-if="true" class="default set-default">Set as default</div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div class="buttons-block">
    <BaseButton label="Add shipping address" />
    <BaseButton label="Add billing address" />
    <BaseButton @click="logOut" label="Log out" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { PencilSquareIcon, ArchiveBoxXMarkIcon } from '@heroicons/vue/20/solid';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import { LocalStorageKeys } from '@/types/enums';
import type { Address, AccountAddressesData } from '@/types/types';
import api from '@/utils/api/client';

export default {
  components: {
    PencilSquareIcon,
    ArchiveBoxXMarkIcon,
    BaseButton,
  },
  data(): AccountAddressesData {
    return {
      addresses: [],
      shippingIds: [],
      defaultShippingId: [],
      shippingAddresses: [],
      billingIds: [],
      defaultBillingId: [],
      billingAddresses: [],
    };
  },
  computed: {
    ...mapStores(useUserStore),
    getShippingAddresses(): Address[] {
      const noDefaultAddresses = this.addresses.filter((el) => !this.defaultShippingId
        .includes(el.id));
      return noDefaultAddresses.filter((el) => this.shippingIds.includes(el.id));
    },
    getDefaultShippingAddress(): string {
      const address = (this.addresses.filter((el) => this.defaultShippingId.includes(el.id)))[0];
      return `${address.streetName}, ${address.city}, ${address.country}, ${address.postalCode}`;
    },
    getBillingAddresses(): Address[] {
      const noDefaultAddress = this.addresses.filter((el) => !this.defaultBillingId
        .includes(el.id));
      return noDefaultAddress.filter((el) => this.billingIds.includes(el.id));
    },
    getDefaultBillingAddress(): string {
      const address = (this.addresses.filter((el) => this.defaultBillingId.includes(el.id)))[0];
      return `${address.streetName}, ${address.city}, ${address.country}, ${address.postalCode}`;
    },
  },
  methods: {
    logOut(): void {
      localStorage.removeItem(LocalStorageKeys.Token);
      api.signOut();
      this.userStore.logoutUser();
      this.$router.push({ name: 'Home' });
    },
    async getData(): Promise<void> {
      try {
        const { body } = await api.call().me().get().execute();
        this.addresses = body.addresses as Address[];
        this.shippingIds = body.shippingAddressIds as string[];
        if (body.defaultShippingAddressId) this.defaultShippingId = [body.defaultShippingAddressId];
        this.billingIds = body.billingAddressIds as string[];
        if (body.defaultBillingAddressId) this.defaultBillingId = [body.defaultBillingAddressId];
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
  created(): void {
    this.getData();
  },
};
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.address-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}
.default {
  border: 1px solid #EB5461;
  border-radius: 10px;
  padding: 2px 21px;
  width: fit-content;
}
.address-line {
  display: flex;
  font-size: 1.5rem;
  gap: 2rem;
}
.icon {
  height: 1.5rem;
  fill: #3A3E3F;
  cursor: pointer;
}
.divider {
width: 200px;
border: 0.5px solid #3A3E3F;
}
.set-default {
  cursor: pointer;
}
.buttons-block {
  display: flex;
  gap: 2rem;
}
</style>
