<template>
  <div class="container">
    <div class="info-container">
      <h3>Shipping addresses</h3>
      <div class="address-block">
        <template v-if="loaded">
          <div v-if="userStore.getDefaultShippingAddressId" class="address-item" :id="userStore.getDefaultShippingAddressId">
            <div class="default-block">
              <CheckIcon class="check-icon" />
              <span class="default">Default</span>
            </div>
            <div class="address-line">
              <span class="address">{{ userStore.defaultShippingAddress }}</span>
              <PencilSquareIcon class="icon edit" />
              <ArchiveBoxXMarkIcon class="icon delete" @click="deleteAddress" />
            </div>
          </div>
          <template v-for="(address) in userStore.shippingAddresses" :key="address.id">
            <div class="address-item" :id=address.id>
              <div v-if="userStore.getDefaultShippingAddressId" class="divider" />
              <div class="address-line">
                <span class="address">{{ addressName(address) }}</span>
                <PencilSquareIcon class="icon edit" />
                <ArchiveBoxXMarkIcon class="icon delete" @click="deleteAddress" />
                <div class="set-default" @click="setDefaultAddress" @keydown="setDefaultAddress">Set as default</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <BaseButton label="Add shipping address" @click="openPopup('shipping')" />
    <div class="info-container">
      <h3>Billing addresses</h3>
      <div class="address-block">
        <template v-if="loaded">
          <div v-if="userStore.getDefaultBillingAddressId" class="address-item" :id="userStore.getDefaultBillingAddressId">
            <div class="default-block">
              <CheckIcon class="check-icon" />
              <span class="default">Default</span>
            </div>
            <div class="address-line">
              <span>{{ userStore.defaultBillingAddress }}</span>
              <PencilSquareIcon class="icon" />
              <ArchiveBoxXMarkIcon class="icon" @click="deleteAddress" />
            </div>
          </div>
          <template v-for="(address) in userStore.billingAddresses" :key="address.id">
            <div class="address-item" :id="address.id">
              <div v-if="userStore.getDefaultBillingAddressId" class="divider" />
              <div class="address-line">
                <span>{{ addressName(address) }}</span>
                <PencilSquareIcon class="icon" />
                <ArchiveBoxXMarkIcon class="icon" @click="deleteAddress" />
                <div class="set-default" @click="setDefaultAddress" @keydown="setDefaultAddress">Set as default</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <BaseButton label="Add billing address" @click="openPopup('billing')" />
    <div class="divider-final" />
  </div>
  <div class="popup-container">
    <BasePopup
      :show="showPopup === true"
      :closeOnDelete="false"
      @close="closePopup">
      <div>
        <AppEditAddressBlock title="" id="addressEditBlock" :section="getAddressSection" @close="closePopup" />
      </div>
    </BasePopup>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { PencilSquareIcon, ArchiveBoxXMarkIcon, CheckIcon } from '@heroicons/vue/20/solid';
import type {
  MyCustomerUpdate,
  MyCustomerRemoveAddressAction,
  MyCustomerRemoveBillingAddressIdAction,
  MyCustomerRemoveShippingAddressIdAction,
  MyCustomerSetDefaultBillingAddressAction,
  MyCustomerSetDefaultShippingAddressAction,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/me';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import BasePopup from '@/components/shared/BasePopup.vue';
import AppEditAddressBlock from '@/components/AppEditAddressBlock.vue';
import type { Address } from '@/types/types';
import api from '@/utils/api/client';

export default {
  components: {
    PencilSquareIcon,
    ArchiveBoxXMarkIcon,
    CheckIcon,
    BaseButton,
    BasePopup,
    AppEditAddressBlock,
  },
  data(): {loaded: boolean; showPopup: boolean; addressSection: string} {
    return {
      loaded: false,
      showPopup: false,
      addressSection: 'shipping',
    };
  },
  computed: {
    ...mapStores(useUserStore),
    getAddressSection(): string {
      return this.addressSection === 'billing' ? 'billing' : 'shipping';
    },
  },
  methods: {
    addressName(address: Address): string {
      return `${address.streetName}, ${address.city}, ${address.country}, ${address.postalCode}`;
    },
    async closePopup(): Promise<void> {
      this.showPopup = false;
      try {
        await this.userStore.getData();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    openPopup(addressSection: string): void {
      this.addressSection = addressSection;
      this.showPopup = true;
    },
    deleteAddressData(id: string,
      action: 'removeAddress'
    | 'removeBillingAddressId'
    | 'removeShippingAddressId',
    ): MyCustomerRemoveAddressAction
    | MyCustomerRemoveBillingAddressIdAction
    | MyCustomerRemoveShippingAddressIdAction {
      return {
        action,
        addressId: id,
      };
    },
    setDefaultAddressData(id: string,
      action: 'setDefaultBillingAddress'
    | 'setDefaultShippingAddress',
    ): MyCustomerSetDefaultBillingAddressAction
    | MyCustomerSetDefaultShippingAddressAction {
      return {
        action,
        addressId: id,
      };
    },
    postDeletedData(id: string, action: 'removeAddress'
    | 'removeBillingAddressId'
    | 'removeShippingAddressId',
    ): MyCustomerUpdate {
      return {
        version: this.userStore.customerData.body.version,
        actions: [this.deleteAddressData(id, action)],
      };
    },
    postDefaultData(id: string, action: 'setDefaultBillingAddress'
    | 'setDefaultShippingAddress',
    ): MyCustomerUpdate {
      return {
        version: this.userStore.customerData.body.version,
        actions: [this.setDefaultAddressData(id, action)],
      };
    },
    getId(event: MouseEvent | KeyboardEvent): string {
      const target = event.target as HTMLDivElement;
      if (target === null) return '';
      const closestAddressItem = target.closest('.address-item');
      if (closestAddressItem === null) return '';
      const deletedAddressId: string | null = closestAddressItem.id;
      return deletedAddressId;
    },
    async deleteAddress(event: MouseEvent): Promise<void> {
      const deletedAddressId = this.getId(event);
      if (deletedAddressId !== null) {
        const billingId = this.userStore.customerData.body.billingAddressIds
          .indexOf(deletedAddressId) !== -1;
        if (billingId) {
          await api.call().me().post({ body: this.postDeletedData(deletedAddressId, 'removeBillingAddressId') }).execute();
          await this.userStore.getData();
        } else {
          await api.call().me().post({ body: this.postDeletedData(deletedAddressId, 'removeShippingAddressId') }).execute();
          await this.userStore.getData();
        }
        await api.call().me().post(({ body: this.postDeletedData(deletedAddressId, 'removeAddress') })).execute();
        await this.userStore.getData();
      }
    },
    async setDefaultAddress(event: MouseEvent | KeyboardEvent): Promise<void> {
      const newDefaultId = this.getId(event);
      const billingId = this.userStore.customerData.body.billingAddressIds
        .indexOf(newDefaultId) !== -1;
      if (billingId) {
        await api.call().me().post({ body: this.postDefaultData(newDefaultId, 'setDefaultBillingAddress') }).execute();
        await this.userStore.getData();
      } else {
        await api.call().me().post({ body: this.postDefaultData(newDefaultId, 'setDefaultShippingAddress') }).execute();
        await this.userStore.getData();
      }
    },
  },
  async created(): Promise<void> {
    try {
      await this.userStore.getData();
      this.loaded = true;
    } catch (error) {
      console.error('Error:', error);
    }
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
.popup-container :deep(.modal-container) {
  padding: 20px;
}

@media(max-width: 700px) {
  .address-line {
    display: grid;
    grid-template-areas: "address edit delete" "set-default set-default set-default";
    justify-items: end;
    row-gap: 1rem;
  }
  .address {
    grid-area: address;
  }
  .edit {
    grid-area: edit;
  }
  .delete {
    grid-area: delete;
  }
  .set-default {
    grid-area: set-default;
  }
}
</style>
