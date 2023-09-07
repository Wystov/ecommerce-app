<template>
  <button
    type="button"
    :disabled="value === 1"
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
    @blur="userInput"
    @keyup.enter="userInput" />
  <button
    type="button"
    :disabled="value === 599"
    class="button-incr"
    @click="manualChange('incr')">
    +
  </button>
</template>

<script lang="ts">
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  emits: ['valueChange'],
  methods: {
    manualChange(action: 'incr' | 'decr'): void {
      const value = action === 'incr' ? this.value + 1 : this.value - 1;
      if (value < 1 || value > 599) return;
      this.$emit('valueChange', value);
    },
    userInput(): void {
      const input = this.$refs.input as HTMLInputElement;
      const value = parseInt(input.value, 10);
      // eslint-disable-next-line default-case
      switch (true) {
        case Number.isNaN(value):
          input.value = this.value.toString();
          return;
        case value < 1:
          input.value = '1';
          this.$emit('valueChange', 1);
          break;
        case value > 599:
          input.value = '599';
          this.$emit('valueChange', 599);
          break;
        default:
          this.$emit('valueChange', value);
      }
    },
  },
};
</script>

<style scoped>
.input {
  width: 50px;
  text-align: center;
  border: none;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  border-radius: none;
  padding: 0.5rem 0;
}
.button-incr,
.button-decr {
  cursor: pointer;
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
