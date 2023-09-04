<template>
  <div class="container">
    <div class="info-container">
      <h3>Shipping addresses</h3>
      <div class="address-block">
        <template v-if="loaded">
          <div
            v-if="userStore.getDefaultShippingAddressId"
            :id="userStore.getDefaultShippingAddressId"
            class="address-item">
            <div class="default-block">
              <CheckIcon class="check-icon" />
              <span class="default">Default</span>
            </div>
            <div class="address-line">
              <span class="address">{{ userStore.defaultShippingAddress }}</span>
              <PencilSquareIcon
                class="icon edit"
                @click="openPopupForEdit" />
              <ArchiveBoxXMarkIcon
                class="icon delete"
                @click="deleteAddress" />
            </div>
          </div>
          <template
            v-for="address in userStore.shippingAddresses"
            :key="address.id">
            <div
              :id="address.id"
              class="address-item">
              <div
                v-if="userStore.getDefaultShippingAddressId"
                class="divider" />
              <div class="address-line">
                <span class="address">{{ addressName(address) }}</span>
                <PencilSquareIcon
                  class="icon edit"
                  @click="openPopupForEdit" />
                <ArchiveBoxXMarkIcon
                  class="icon delete"
                  @click="deleteAddress" />
                <div
                  class="set-default"
                  @click="setDefaultAddress"
                  @keydown="setDefaultAddress">
                  Set as default
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <BaseButton
      label="Add shipping address"
      @click="openPopupForCreate('shipping')" />
    <div class="info-container">
      <h3>Billing addresses</h3>
      <div class="address-block">
        <template v-if="loaded">
          <div
            v-if="userStore.getDefaultBillingAddressId"
            :id="userStore.getDefaultBillingAddressId"
            class="address-item">
            <div class="default-block">
              <CheckIcon class="check-icon" />
              <span class="default">Default</span>
            </div>
            <div class="address-line">
              <span>{{ userStore.defaultBillingAddress }}</span>
              <PencilSquareIcon
                class="icon"
                @click="openPopupForEdit" />
              <ArchiveBoxXMarkIcon
                class="icon"
                @click="deleteAddress" />
            </div>
          </div>
          <template
            v-for="address in userStore.billingAddresses"
            :key="address.id">
            <div
              :id="address.id"
              class="address-item">
              <div
                v-if="userStore.getDefaultBillingAddressId"
                class="divider" />
              <div class="address-line">
                <span>{{ addressName(address) }}</span>
                <PencilSquareIcon
                  class="icon"
                  @click="openPopupForEdit" />
                <ArchiveBoxXMarkIcon
                  class="icon"
                  @click="deleteAddress" />
                <div
                  class="set-default"
                  @click="setDefaultAddress"
                  @keydown="setDefaultAddress">
                  Set as default
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <BaseButton
      label="Add billing address"
      @click="openPopupForCreate('billing')" />
    <div class="divider-final" />
  </div>
  <div class="popup-container">
    <BasePopup
      :show="showPopup === true"
      :closeOnDelete="false"
      @close="closePopup">
      <div>
        <AppEditAddressBlock
          id="addressEditBlock"
          title=""
          :section="getAddressSection"
          :editAddressId="addressId"
          @close="closePopup"
          @showSuccessMessage="showSuccessMessage" />
      </div>
    </BasePopup>
  </div>
  <Transition>
    <div
      v-if="showMessageEditSuccess"
      class="success-message-container">
      <Transition>
        <BaseMessage
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
import BaseMessage from '@/components/shared/BaseMessage.vue';
import AppEditAddressBlock from '@/components/AppEditAddressBlock.vue';
import type { Address, AccountAddressData } from '@/types/types';
import api from '@/utils/api/client';

export default {
  components: {
    PencilSquareIcon,
    ArchiveBoxXMarkIcon,
    CheckIcon,
    BaseButton,
    BasePopup,
    AppEditAddressBlock,
    BaseMessage,
  },
  data(): AccountAddressData {
    return {
      loaded: false,
      showPopup: false,
      addressSection: 'shipping',
      addressId: '',
      showMessageEditSuccess: false,
      createCustomerMessage: {
        text: 'You will be able to see the changes in a few seconds...',
        alert: 'success',
        title: 'Changes made successfully!',
      },
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
    openPopupForCreate(addressSection: string): void {
      this.addressId = '';
      this.addressSection = addressSection;
      this.showPopup = true;
    },
    openPopupForEdit(event: MouseEvent): void {
      const id = this.getId(event);
      this.addressId = id;
      this.showPopup = true;
    },
    deleteAddressData(
      id: string,
      action: 'removeAddress' | 'removeBillingAddressId' | 'removeShippingAddressId',
    ):
      | MyCustomerRemoveAddressAction
      | MyCustomerRemoveBillingAddressIdAction
      | MyCustomerRemoveShippingAddressIdAction {
      return {
        action,
        addressId: id,
      };
    },
    setDefaultAddressData(
      id: string,
      action: 'setDefaultBillingAddress' | 'setDefaultShippingAddress',
    ): MyCustomerSetDefaultBillingAddressAction | MyCustomerSetDefaultShippingAddressAction {
      return {
        action,
        addressId: id,
      };
    },
    postDeletedData(
      id: string,
      action: 'removeAddress' | 'removeBillingAddressId' | 'removeShippingAddressId',
    ): MyCustomerUpdate {
      return {
        version: this.userStore.customerData.body.version,
        actions: [this.deleteAddressData(id, action)],
      };
    },
    postDefaultData(
      id: string,
      action: 'setDefaultBillingAddress' | 'setDefaultShippingAddress',
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
        const billingId =
          this.userStore.customerData.body.billingAddressIds.indexOf(deletedAddressId) !== -1;
        if (billingId) {
          await api
            .call()
            .me()
            .post({ body: this.postDeletedData(deletedAddressId, 'removeBillingAddressId') })
            .execute();
          await this.userStore.getData();
        } else {
          await api
            .call()
            .me()
            .post({ body: this.postDeletedData(deletedAddressId, 'removeShippingAddressId') })
            .execute();
          await this.userStore.getData();
        }
        await api
          .call()
          .me()
          .post({ body: this.postDeletedData(deletedAddressId, 'removeAddress') })
          .execute();
        await this.userStore.getData();
      }
    },
    async setDefaultAddress(event: MouseEvent | KeyboardEvent): Promise<void> {
      const newDefaultId = this.getId(event);
      const billingId =
        this.userStore.customerData.body.billingAddressIds.indexOf(newDefaultId) !== -1;
      if (billingId) {
        await api
          .call()
          .me()
          .post({ body: this.postDefaultData(newDefaultId, 'setDefaultBillingAddress') })
          .execute();
        await this.userStore.getData();
      } else {
        await api
          .call()
          .me()
          .post({ body: this.postDefaultData(newDefaultId, 'setDefaultShippingAddress') })
          .execute();
        await this.userStore.getData();
      }
    },
    showSuccessMessage(): void {
      this.showMessageEditSuccess = true;
      setTimeout(() => {
        this.showMessageEditSuccess = false;
      }, 1500);
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
  fill: #3a3e3f;
  cursor: pointer;
}
.check-icon {
  width: 1.2rem;
  fill: var(--main-color);
}
.divider {
  width: 200px;
  border: 0.5px solid #3a3e3f;
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
  grid-template-areas: 'button button' 'divider divider';
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
@media (max-width: 768px) {
  .popup-container :deep(.circle) {
    width: 50px;
    height: 50px;
    right: 0.5em;
    top: 0.5em;
  }
  .info-edit-header {
    width: 90%;
  }
}
@media (max-width: 700px) {
  .address-line {
    display: grid;
    grid-template-areas: 'address edit delete' 'set-default set-default set-default';
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
@media (max-width: 550px) {
  .popup-container :deep(.popup-default) {
    width: min(90vh, 90vw);
  }
  .info-edit-header {
    width: 87%;
    font-size: 1.2rem;
  }
  .buttons-block :deep(.button) {
    padding: 15px 13px;
  }
  .popup-container :deep(.circle) {
    width: 40px;
    height: 40px;
    font-size: 15px;
    right: 1em;
    top: 1em;
  }
}
</style>
