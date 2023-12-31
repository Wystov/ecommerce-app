<template>
  <h3
    v-if="editAddressId !== ''"
    class="info-edit-header">
    Please fill only the fields you want to change and press "Edit" button:
  </h3>
  <div class="address-block">
    <BaseSelect
      :id="id + '-select-country'"
      :defaultSelected="existingCountry"
      :label="countryField.label"
      valid="valid"
      :options="countryField.options"
      @selectOption="selectCountry" />
    <div
      v-for="(field, i) in fields"
      :key="i"
      class="field-container">
      <BaseInput
        :id="id + field.label.toLowerCase()"
        :label="field.label.replace('Name', '')"
        :name="getPlaceholder(field.fieldName)"
        :valid="field.valid"
        @input="handleInput($event, i)"
        @focusin="field.showMessage = true"
        @focusout="field.showMessage = false" />
      <Transition>
        <BaseMessage
          v-if="field.showMessage && field.valid === 'invalid'"
          absolute
          arrow="top"
          alert="danger">
          {{ field.invalidMessage }}
        </BaseMessage>
      </Transition>
    </div>
  </div>
  <BaseButton
    v-if="editAddressId === ''"
    class="btn-update"
    @click="updateInfo">
    Add {{ buttonName }} address
  </BaseButton>
  <BaseButton
    v-if="editAddressId !== ''"
    class="btn-update"
    @click="editInfo">
    Edit
  </BaseButton>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { postcodeValidator } from 'postcode-validator';
import type {
  MyCustomerAddAddressAction,
  MyCustomerUpdate,
  MyCustomerAddBillingAddressIdAction,
  MyCustomerAddShippingAddressIdAction,
  MyCustomerChangeAddressAction,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/me';
import type { BaseAddress } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import { Country, InvalidMessage } from '@/types/enums';
import type { RegistrationAddressData, Address } from '@/types/types';
import api from '@/utils/api/client';
import { useUserStore } from '@/stores/user';
import toCamelCase from '../utils/toCamelCase';

export default {
  components: {
    BaseInput,
    BaseMessage,
    BaseSelect,
    BaseButton,
  },
  props: {
    title: { type: String, required: true },
    id: { type: String, required: true },
    section: { type: String, required: true },
    editAddressId: { type: String, default: '' },
  },
  emits: ['valid-all-address-fields', 'close', 'showSuccessMessage'],
  // eslint-disable-next-line max-lines-per-function
  data(): RegistrationAddressData {
    return {
      countryField: {
        label: 'Country',
        options: [
          { text: Country.US, value: 'US', placeholder: '10001' },
          { text: Country.GB, value: 'GB', placeholder: 'W10BB' },
        ],
        defaultSelectedCountry: 'US',
        value: 'US',
        valid: 'valid',
      },
      fields: [
        {
          label: 'City',
          fieldName: 'city',
          pattern: /^[a-zA-Z\s]+$/,
          placeholder: 'New York',
          value: '',
          invalidMessage: InvalidMessage.City,
          showMessage: false,
        },
        {
          label: 'Street Name',
          fieldName: 'streetName',
          pattern: /^.*\S.*$/,
          placeholder: 'Wall Street',
          value: '',
          invalidMessage: InvalidMessage.Street,
          showMessage: false,
        },
        {
          label: 'Postal Code',
          fieldName: 'postalCode',
          placeholder: '10001',
          value: '',
          invalidMessage: InvalidMessage.PostalCode,
          showMessage: false,
        },
      ],
    };
  },
  computed: {
    ...mapStores(useUserStore),
    buttonName(): string {
      return this.section === 'billing' ? 'billing' : 'shipping';
    },
    addressData(): BaseAddress {
      return {
        country: this.countryField.value,
        streetName: this.fields[1].value,
        postalCode: this.fields[2].value,
        city: this.fields[0].value,
      };
    },
    editAddressData(): BaseAddress {
      return {
        country: this.editCountryValue,
        streetName: this.editStreetValue,
        postalCode: this.editPostalCodeValue,
        city: this.editCityValue,
      };
    },
    postAddressData(): MyCustomerAddAddressAction {
      return {
        action: 'addAddress',
        address: this.addressData,
      };
    },
    newAddress(): string {
      const billingShippingAddressesArr = this.userStore.customerData.body.billingAddressIds.concat(
        this.userStore.customerData.body.shippingAddressIds,
      );
      const addressesArr = this.userStore.customerData.body.addresses.map((el: Address) => el.id);
      return addressesArr.filter((el: string) => billingShippingAddressesArr.indexOf(el) === -1)[0];
    },
    allFieldsReady(): boolean {
      return this.fields.every((el) => el.value !== '');
    },
    readyToEdit(): boolean {
      return (
        this.fields.some((el) => el.value !== '') ||
        this.countryField.value !== this.existingCountry
      );
    },
    editingAddressIndex(): number {
      return this.userStore.customerData.body.addresses.findIndex(
        (el: Address) => el.id === this.editAddressId,
      );
    },
    existingCity(): string {
      return this.editAddressId !== ''
        ? this.userStore.customerData.body.addresses[this.editingAddressIndex].city
        : 'New York';
    },
    editCityValue(): string | undefined {
      return this.fields[0].value === '' ? this.existingCity : this.fields[0].value;
    },
    existingCountry(): string {
      return this.editAddressId !== ''
        ? this.userStore.customerData.body.addresses[this.editingAddressIndex].country
        : 'US';
    },
    editCountryValue(): string {
      return this.countryField.value === this.existingCountry
        ? this.existingCountry
        : this.countryField.value;
    },
    existingStreet(): string {
      return this.editAddressId !== ''
        ? this.userStore.customerData.body.addresses[this.editingAddressIndex].streetName
        : 'Wall Street';
    },
    editStreetValue(): string | undefined {
      return this.fields[1].value === '' ? this.existingStreet : this.fields[1].value;
    },
    existingPostalCode(): string {
      const defaultValue = this.existingCountry === 'US' ? '10001' : 'W10BB';
      return this.editAddressId !== ''
        ? this.userStore.customerData.body.addresses[this.editingAddressIndex].postalCode
        : defaultValue;
    },
    editPostalCodeValue(): string | undefined {
      return this.fields[2].value === '' ? this.existingPostalCode : this.fields[2].value;
    },
  },
  methods: {
    handleInput(event: Event, index: number): void {
      this.setValue(event, index);
      this.checkValid(index);
      this.readyData();
    },
    selectCountry(value: string): void {
      this.countryField.value = value;
      const field = this.fields.find((elem) => elem.label === 'Postal Code');
      const postCode = field?.value;

      if (postCode) {
        field.valid = postcodeValidator(postCode, this.countryField.value) ? 'valid' : 'invalid';
      }
      if (field) {
        field.placeholder = this.countryField.options.find((option) => option.value === value)
          ?.placeholder;
      }
      this.readyData();
    },
    setValue(event: Event, index: number): void {
      const input = event.target as HTMLInputElement;
      const field = this.fields[index];
      field.value = input.value.trim();
    },
    checkValid(index: number): void {
      const field = this.fields[index];

      if (field.value === '') field.valid = '';

      if (field.value && field.pattern) {
        const inputText = field.value;
        field.valid = field.pattern.test(inputText) ? 'valid' : 'invalid';
      }
      if (field.value && field.label === 'Postal Code') {
        const postCode = field.value;
        field.valid = postcodeValidator(postCode, this.countryField.value) ? 'valid' : 'invalid';
      }
    },
    readyData(): void {
      const fields = [...this.fields, this.countryField];
      const isAllFieldsValid = fields.every(
        (fieldItem) => fieldItem.value !== '' && fieldItem.valid === 'valid',
      );
      if (isAllFieldsValid) {
        const sendFields = fields.map((elem) => [toCamelCase(elem.label), elem.value]);
        const response = { name: this.id, fields: Object.fromEntries(sendFields) };
        this.$emit('valid-all-address-fields', { valid: true, response });
      } else {
        const response = { name: this.id, fields: {} };
        this.$emit('valid-all-address-fields', { valid: false, response });
      }
    },
    getPlaceholder(dataName: string | undefined): string {
      if (dataName === 'city') return this.existingCity;
      if (dataName === 'postalCode') return this.existingPostalCode;
      if (dataName === 'streetName') return this.existingStreet;
      return '';
    },
    postData(
      action:
        | MyCustomerAddAddressAction
        | MyCustomerAddShippingAddressIdAction
        | MyCustomerAddBillingAddressIdAction
        | MyCustomerChangeAddressAction,
    ): MyCustomerUpdate {
      return {
        version: this.userStore.customerData.body.version,
        actions: [action],
      };
    },
    postEditData(): MyCustomerChangeAddressAction {
      return {
        action: 'changeAddress',
        addressId: this.editAddressId,
        address: this.editAddressData,
      };
    },
    addressIdData(
      action: 'addShippingAddressId' | 'addBillingAddressId',
      id: string,
    ): MyCustomerAddShippingAddressIdAction | MyCustomerAddBillingAddressIdAction {
      return {
        action,
        addressId: id,
      };
    },
    async updateInfo(): Promise<void> {
      if (this.allFieldsReady) {
        try {
          const data = await api
            .call()
            .me()
            .post({ body: this.postData(this.postAddressData) })
            .execute();
          this.userStore.setCustomerData(data);
          const newAddressId = this.newAddress;
          const newData = this.section === 'billing'
            ? await api.call().me()
              .post({
                body: this.postData(this.addressIdData('addBillingAddressId', newAddressId)),
              })
              .execute()
            : await api.call().me()
              .post({
                body: this.postData(this.addressIdData('addShippingAddressId', newAddressId)),
              })
              .execute();
          this.userStore.setCustomerData(newData);
          this.$emit('close');
          this.$emit('showSuccessMessage');
        } catch (error) {
          if (error instanceof Error) console.log('Error occurred:', error.message);
        }
      }
    },
    async editInfo(): Promise<void> {
      if (this.readyToEdit) {
        try {
          const data = await api
            .call()
            .me()
            .post({ body: this.postData(this.postEditData()) })
            .execute();
          this.userStore.setCustomerData(data);
          this.$emit('close');
          this.$emit('showSuccessMessage');
        } catch (error) {
          if (error instanceof Error) console.log('Error occurred:', error.message);
        }
      }
    },
  },
};
</script>
<style scoped>
.field-container {
  position: relative;
}
.address-block {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 20px 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
@media (max-width: 768px) {
  .registration-address {
    display: flex;
    flex-direction: column;
  }
  .info-edit-header {
    width: 90%;
  }
}
@media (max-width: 550px) {
  .info-edit-header {
    width: 87%;
    font-size: 1.2rem;
  }
}
</style>
