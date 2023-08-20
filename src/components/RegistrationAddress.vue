<template>
  <h3>{{ title }}</h3>
  <div class="registration-address">
    <BaseSelect
      @selectOption="selectCountry"
      :defaultSelected="countryField.defaultSelectedCountry"
      :id="id + '-select-country'"
      :label="countryField.label"
      valid="valid"
      :options="countryField.options"
    />
    <div class="field-container" v-for="(field, i) in fields" :key="i">
      <BaseInput
        :label="field.label.replace('Name', '')"
        :name="field.placeholder"
        @input="handleInput($event, i)"
        :valid="field.valid"
        :id="id + '-field-registration-' + field.label.toLowerCase()"
        @focusin="field.showMessage = true"
        @focusout="field.showMessage = false"
      />
      <Transition>
        <BaseMessage
          absolute
          arrow="top"
          v-if="field.showMessage && field.valid === 'invalid'"
          alert="danger"
        >
          {{ field.invalidMessage }}</BaseMessage
        >
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
import { postcodeValidator } from 'postcode-validator';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseMessage from '@/components/shared/BaseMessage.vue';
import BaseSelect from '@/components/shared/BaseSelect.vue';
import { Country, InvalidMessage } from '@/types/enums';
import { type RegistrationAddressData } from '@/types/types';
import toCamelCase from '../utils/toCamelCase';

export default {
  emits: ['valid-all-address-fields'],
  components: {
    BaseInput,
    BaseMessage,
    BaseSelect,
  },
  props: {
    title: { type: String, required: true },
    id: { type: String, required: true },
  },
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
          pattern: /^[a-zA-Z\s]+$/,
          placeholder: 'New York',
          value: '',
          invalidMessage: InvalidMessage.City,
          showMessage: false,
        },
        {
          label: 'Street Name',
          pattern: /^.*\S.*$/,
          placeholder: 'Wall Street',
          value: '',
          invalidMessage: InvalidMessage.Street,
          showMessage: false,
        },
        {
          label: 'Postal Code',
          placeholder: '10001',
          value: '',
          invalidMessage: InvalidMessage.PostalCode,
          showMessage: false,
        },
      ],
    };
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
    },

    setValue(e: Event, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];

      field.value = input.value.trim();
    },

    checkValid(i: number): void {
      const field = this.fields[i];

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
  },
};
</script>
<style scoped>
.field-container {
  position: relative;
}
.registration-address {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
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
}
</style>
