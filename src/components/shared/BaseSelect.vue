<template>
  <div class="select-group">
    <label
      v-if="label"
      :for="id">
      {{ label }}
    </label>
    <select
      :id="id"
      v-model="selected"
      class="select"
      :class="classes"
      @input="checkValid">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
import type { SelectOptions, SelectClasses } from '../../types/types';

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    isPlain: {
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
    defaultSelected: {
      type: String,
      required: true,
    },
  },
  emits: ['selectOption'],
  data(): { selected: string } {
    return {
      selected: '',
    };
  },
  computed: {
    classes(): SelectClasses {
      return {
        'dark-theme-input': this.isDark,
        'valid-focus-decorator': this.valid === 'valid',
        'invalid-focus-decorator': this.valid === 'invalid',
        'plain-input': this.isPlain,
      };
    },
  },
  methods: {
    checkValid(e: Event): void {
      const select = e.target as HTMLSelectElement;
      if (select) {
        this.selected = select.value;
        this.$emit('selectOption', select.value);
      }
    },
  },
  created(): void {
    if (this.selected === '') {
      this.selected = this.defaultSelected;
    }
  },
};
</script>
<style scoped>
label {
  color: var(--main-font-color);
  font-size: 16px;
  font-weight: 500;
}
.select-group {
  display: flex;
  flex-direction: column;
  font-family: var(--main-font-style);
  gap: 0.5rem;
  font-size: 1rem;
  height: fit-content;
}

.select {
  cursor: pointer;
  border: 1.5px solid var(--main-color-outline);
  font-size: 1rem;
  outline: none;
  height: 2.6rem;
  border-radius: 10px;
  padding: 0.1rem 1.2rem;
  appearance: none;
  background: url('../../assets/icons/arrow_down.svg') no-repeat right;
  background-position-x: calc(100% - 16px);
}

.input::placeholder {
  color: var(--placeholder-font-color);
  font-size: 1.1rem;
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
.plain-input {
  border: none;
  background-position-x: right;
}
</style>
