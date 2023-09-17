<template>
  <button
    type="button"
    :disabled="value === min || disabled"
    class="button-decr"
    @click="manualChange('decr')">
    -
  </button>
  <input
    ref="input"
    class="input"
    type="text"
    name="count"
    :value="value"
    @input="userInput" />
  <button
    type="button"
    :disabled="value === max || disabled"
    class="button-incr"
    @click="manualChange('incr')">
    +
  </button>
</template>

<script lang="ts">
import { debounce } from 'lodash';

export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['valueChange'],
  methods: {
    manualChange(action: 'incr' | 'decr'): void {
      const input = this.$refs.input as HTMLInputElement;
      if (!input) return;
      const value = action === 'incr' ? +input.value + 1 : +input.value - 1;
      if (value < this.min || value > this.max) return;
      this.$emit('valueChange', value);
    },
    userInput(): void {
      const input = this.$refs.input as HTMLInputElement;
      if (!input) return;
      input.value = input.value.replace(/[^0-9]/g, '');
      this.debounceUserInput(input, this.min, this.max, this.value, this.$emit);
    },
    debounceUserInput: debounce(
      (inputElement: HTMLInputElement, min, max, initValue, emit) => {
        const input = inputElement;
        const value = parseInt(input.value, 10);

        switch (true) {
          case Number.isNaN(value):
            input.value = initValue.toString();
            return;
          case value < min:
            input.value = '1';
            emit('valueChange', min);
            break;
          case value > max:
            input.value = max.toString();
            emit('valueChange', max);
            break;
          default:
            emit('valueChange', value);
        }
      },
      1000,
      {
        trailing: true,
      },
    ),
  },
};
</script>

<style scoped>
.input {
  width: 50px;
  text-align: center;
  border: none;
  outline: none;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  border-radius: 0;
  padding: 0.5rem 0;
}
.button-incr,
.button-decr {
  cursor: pointer;
  color: var(--main-font-color);
  border: 1px solid #e9e9e9;
  background-color: #e9e9e9;
  padding: 0.5rem 0.6rem;
  transition: 0.3s;
}
.button-decr {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.button-incr {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.button-incr:hover,
.button-decr:hover {
  border: 1px solid transparent;
  background-color: #c3c3c3;
}
.button-incr:disabled,
.button-decr:disabled {
  cursor: not-allowed;
  color: #3a3e3f77;
}
</style>
