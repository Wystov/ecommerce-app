<template>
  <div class="info-container">
    <h4>Shipping addresses</h4>
    <div class="address-block">
      <template v-if="loaded">
        <div v-if="userStore.getDefaultShippingAddressId" class="address-item">
          <div class="default">Default</div>
          <div class="address-line">
            <span>{{ userStore.defaultShippingAddress }}</span>
            <PencilSquareIcon class="icon" />
            <ArchiveBoxXMarkIcon class="icon" />
          </div>
        </div>
        <template v-for="(address) in userStore.shippingAddresses" :key="address.id">
          <div class="address-item">
            <div v-if="userStore.getDefaultShippingAddressId" class="divider" />
            <div class="address-line">
              <span>{{ addressName(address) }}</span>
              <PencilSquareIcon class="icon" />
              <ArchiveBoxXMarkIcon class="icon" />
              <div v-if="true" class="default set-default">Set as default</div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
  <div class="info-container">
    <h4>Billing addresses</h4>
    <div class="address-block">
      <template v-if="loaded">
        <div v-if="userStore.getDefaultBillingAddressId" class="address-item">
          <div class="default">Default</div>
          <div class="address-line">
            <span>{{ userStore.defaultBillingAddress }}</span>
            <PencilSquareIcon class="icon" />
            <ArchiveBoxXMarkIcon class="icon" />
          </div>
        </div>
        <template v-for="(address) in userStore.billingAddresses" :key="address.id">
          <div class="address-item">
            <div v-if="userStore.getDefaultBillingAddressId" class="divider" />
            <div class="address-line">
              <span>{{ addressName(address) }}</span>
              <PencilSquareIcon class="icon" />
              <ArchiveBoxXMarkIcon class="icon" />
              <div v-if="true" class="default set-default">Set as default</div>
            </div>
          </div>
        </template>
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
import type { Address } from '@/types/types';
import api from '@/utils/api/client';

export default {
  components: {
    PencilSquareIcon,
    ArchiveBoxXMarkIcon,
    BaseButton,
  },
  data(): {loaded: boolean} {
    return {
      loaded: false,
    };
  },
  computed: {
    ...mapStores(useUserStore),
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
        const response = await api.call().me().get().execute();
        this.userStore.setCustomerData(response);
        this.loaded = true;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    addressName(address: Address): string {
      return `${address.streetName}, ${address.city}, ${address.country}, ${address.postalCode}`;
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
