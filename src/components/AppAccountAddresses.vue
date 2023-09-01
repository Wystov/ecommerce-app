<template>
  <div class="container">
    <div class="info-container">
      <h3>Shipping addresses</h3>
      <div class="address-block">
        <template v-if="loaded">
          <div v-if="userStore.getDefaultShippingAddressId" class="address-item">
            <div class="default-block">
              <CheckIcon class="check-icon" />
              <span class="default">Default</span>
            </div>
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
                <div class="set-default">Set as default</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <BaseButton label="Add shipping address" />
    <div class="info-container">
      <h3>Billing addresses</h3>
      <div class="address-block">
        <template v-if="loaded">
          <div v-if="userStore.getDefaultBillingAddressId" class="address-item">
            <div class="default-block">
              <CheckIcon class="check-icon" />
              <span class="default">Default</span>
            </div>
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
                <div class="set-default">Set as default</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <BaseButton label="Add billing address" />
    <div class="divider-final" />
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { PencilSquareIcon, ArchiveBoxXMarkIcon, CheckIcon } from '@heroicons/vue/20/solid';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import type { Address } from '@/types/types';
import api from '@/utils/api/client';

export default {
  components: {
    PencilSquareIcon,
    ArchiveBoxXMarkIcon,
    CheckIcon,
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
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.address-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0 0 0;
}
.address-line {
  display: flex;
  align-items: center;
  font-size: 1rem;
  gap: 2rem;
}
.icon {
  height: 1.5rem;
  fill: #3A3E3F;
  cursor: pointer;
}
.check-icon {
  width: 1.2rem;
  fill: var(--main-color);
}
.divider {
width: 200px;
border: 0.5px solid #3A3E3F;
}
.default-block {
  display: flex;
  justify-content: flex-start;
  gap: 0.3rem;
  height: 1rem;
}
.set-default {
  cursor: pointer;
  border: 1px solid var(--main-font-color);
  font-size: 1rem;
  padding: 3px 21px;
  border-radius: 10px;
}
.buttons-block {
  display: grid;
  grid-template-areas: "button button" "divider divider";
  gap: 2rem;
}
.container :deep(.button) {
  background-color: transparent;
  color: var(--main-font-color);
  border: 1.5px solid var(--main-font-color);
  width: fit-content;
}
.container :deep(.button:hover) {
  border-color: var(--main-color);
}
.divider-final {
  width: 100%;
  border: 0.75px solid var(--main-font-color);
  grid-area: divider;
}
</style>
