<template>
  <div class="checkbox-block">
    <input
      type="checkbox"
      id="{{ id }}"
      name="{{ name }}"
      class="checkbox"
      :class="{ 'dark-theme-checkbox': isDark }"
      :checked="checked"
      :disabled="disabled"
    />
    <label for="{{ id }}" class="label" :class="{ 'dark-theme-label': isDark }">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import '../../assets/styles/style.css';

export default {
  props: {
    label: { type: String, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    isDark: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.checkbox-block {
  display: flex;
  font-family: var(--main-font-style);
  gap: 0.5rem;
  font-size: 1rem;
  height: fit-content;
  margin: 0.2rem 0;
}
.checkbox {
  position: absolute;
  opacity: 0;
}

.label {
  color: var(--main-font-color);
}

.checkbox + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}
.checkbox + label::before {
  content: '';
  display: inline-block;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid var(--main-font-color);
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}

.checkbox:checked + label::before {
  border-color: var(--main-purple);
  background-color: var(--main-purple);
}

.checkbox:not(:disabled):not(:checked) + label:hover::before {
  border-color: var(--main-purple);
}

.dark-theme-checkbox + label::before {
  border: 1px solid var(--dark-theme-font-color);
}

.dark-theme-checkbox:checked + label::before {
  border-color: var(--dark-theme-font-color);
  background-color: var(--main-purple);
}

.dark-theme-checkbox:not(:disabled):not(:checked) + label:hover::before {
  border-color: var(--dark-theme-font-color);
}

.dark-theme-label {
  color: var(--dark-theme-font-color);
}
</style>