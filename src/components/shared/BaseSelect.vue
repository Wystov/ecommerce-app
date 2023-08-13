<template>
  <div class="select-group">
    <label v-if="label" :for="id"> {{ label }}</label>
    <select
      :id="id"
      class="select"
      v-model="selected"
      :placeholder="placeholder ? placeholder : ''"
      :class="classes"
    >
      <option v-for="option in options" :value="option.value" :key="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
import type { SelectOptions, SelectClasses } from '../../types/types';

export default {
  data(): { selected: string } {
    return {
      selected: this.options[0].value,
    };
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    valid: {
      type: String,
      default: '',
    },
    options: {
      type: Array<SelectOptions>,
      required: true,
    },
  },
  computed: {
    classes(): SelectClasses {
      return {
        'dark-theme-input': this.isDark,
        'valid-focus-decorator': this.valid === 'valid',
        'invalid-focus-decorator': this.valid === 'invalid',
      };
    },
  },
};
</script>
<style scoped>
.select-group {
  display: flex;
  flex-direction: column;
  font-family: var(--main-font-style);
  gap: 0.5rem;
  font-size: 1rem;
  height: fit-content;
}
.select {
  background: transparent;
  border: 1.5px solid var(--main-purple);
  border-radius: 3px;
  font-size: 1rem;
  padding: 0.1rem 0.3rem;
  outline: none;
  width: 100%;
}
.input::placeholder {
  color: var(--placeholder-font-color);
  font-size: 0.8rem;
}
.valid-focus-decorator {
  border: 1.5px solid #3c763d;
}
.invalid-input:focus {
  border: 1.5px solid #a94442;
}
.invalid-focus-decorator {
  border: 1.5px solid #a94442;
}
.dark-theme-input {
  border: 1px solid var(--dark-theme-font-color);
  color: var(--dark-theme-font-color);
}
.dark-theme-input::placeholder {
  color: var(--dark-theme-font-color);
}
</style>
