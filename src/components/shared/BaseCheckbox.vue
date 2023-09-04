<template>
  <div class="checkbox-block">
    <input
      :id="id"
      type="checkbox"
      :name="name"
      class="checkbox"
      :class="{ 'dark-theme-checkbox': isDark }"
      :checked="checked"
      :disabled="disabled" />
    <label :for="id" class="label" :class="{ 'dark-theme-label': isDark }">
      {{ label }}<slot />
    </label>
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
  position: relative;
  font-family: var(--main-font-style);
  gap: 0.5rem;
  font-size: 1rem;
  height: fit-content;
  margin: 0.2rem 0;
}

.checkbox {
  position: absolute;
  opacity: 0;
  appearance: none;
}

.label {
  color: var(--main-font-color);
}

.checkbox + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
  padding-left: 25px;
  cursor: pointer;
}

.checkbox + label::before {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid var(--main-font-color);
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 70% 70%;
  transition: 0.3s;
}
.checkbox + label::after {
  background: url('../../assets/icons/ok.svg') no-repeat;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  content: '';
  display: inline-block;
  position: absolute;
  z-index: 1;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid var(--main-font-color);
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 70% 70%;
  transition: 0.3s;
}
.dark-theme-checkbox + label::after {
  background: url('../../assets/icons/ok-white.svg') no-repeat;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  content: '';
  display: inline-block;
  position: absolute;
  z-index: 1;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid var(--dark-theme-font-color);
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 70% 70%;
  transition: 0.3s;
}
.checkbox:checked + label::after {
  opacity: 1;
}
.checkbox:not(:disabled):not(:checked) + label:hover::before {
  border-color: var(--main-color-outline);
}

.dark-theme-checkbox + label::before {
  border: 1px solid var(--dark-theme-font-color);
}

.dark-theme-checkbox:not(:disabled):not(:checked) + label:hover::before {
  border-color: var(--dark-theme-font-color);
}

.dark-theme-label {
  color: var(--dark-theme-font-color);
}
</style>
