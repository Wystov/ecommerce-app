<template>
  <h3>{{ title }}</h3>
  <div class="registration-address">
    <div class="field-container" v-for="(field, i) in fields" :key="i">
      <BaseInput
        :label="field.label"
        :name="field.placeholder"
        @input="[checkValid($event, i), setValue($event, i)]"
        :valid="field.valid"
        :id="id + '-field-registration-' + field.label.toLowerCase()"
      />
      <Transition>
        <BaseMessage v-if="field.invalidMessage && field.valid === 'invalid'" alert="danger">{{
          field.invalidMessage
        }}</BaseMessage>
      </Transition>
    </div>
    <BaseSelect
      @selectOption="selectCountry"
      :defaultSelected="countryField.defaultSelectedCountry"
      :id="id + '-select-country'"
      :label="countryField.label"
      valid="valid"
      :options="countryField.options"
    />
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
  // eslint-disable-next-line max-lines-per-function
  data(): RegistrationAddressData {
    return {
      fields: [
        {
          label: 'Street',
          pattern: /^.*\S.*$/,
          placeholder: 'Wall Street',
          value: '',
          invalidMessage: InvalidMessage.Street,
        },
        {
          label: 'City',
          pattern: /^[a-zA-Z\s]+$/,
          placeholder: 'New York',
          value: '',
          invalidMessage: InvalidMessage.City,
        },
        {
          label: 'Postal Code',
          placeholder: '10001',
          value: '',
          invalidMessage: InvalidMessage.PostalCode,
        },
      ],
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
    };
  },
  methods: {
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
    checkValid(e: Event, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];

      if (input !== null && field.pattern) {
        field.valid = field.pattern.test(input.value) ? 'valid' : 'invalid';
      }
      if (input !== null && field.label === 'Postal Code') {
        const postCode = input.value;
        field.valid = postcodeValidator(postCode, this.countryField.value) ? 'valid' : 'invalid';
        field.value = input.value;
      }
    },
    setValue(e: Event, i: number): void {
      const input = e.target as HTMLInputElement;
      const field = this.fields[i];

      if (input !== null) field.value = input.value;
      const fields = [...this.fields, this.countryField];
      if (fields.every((fieldItem) => fieldItem.value !== '' && fieldItem.valid === 'valid')) {
        const sendFields = fields.map((elem) => {
          if (elem.label === 'Street') {
            return [toCamelCase(`${elem.label} Name`), elem.value];
          }
          return [toCamelCase(elem.label), elem.value];
        });
        const body = { name: this.id, fields: Object.fromEntries(sendFields) };
        this.$emit('valid-all-address-fields', body);
      } else {
        this.$emit('valid-all-address-fields', null);
      }
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
