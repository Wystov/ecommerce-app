<template>
  <div class="inputBlock">
    <label for="inputField" class="label" :class="{ darkThemeLabel: isDark }" v-if="label">{{
      label
    }}</label>
    <input
      type="text"
      id="inputField"
      :placeholder="name ? name : ''"
      v-model.trim="inputValue"
      class="input"
      :class="{ darkThemeInput: isDark }"
      :disabled="disabled"
      :style="{ width: size }"
    />
  </div>
</template>

<script lang="ts">
import '@/assets/styles/style.css';

export default {
  components: {},
  data(): { inputValue: string } {
    return {
      inputValue: '',
    };
  },
  props: {
    label: {
      type: String,
      default: '',
      required: false,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '100%',
    },
  },
};
</script>

<style scoped>
.inputBlock {
  display: flex;
  flex-direction: column;
  font-family: var(--main-font-style);
  gap: 0.5rem;
  font-size: 1rem;
  height: fit-content;
}

.input {
  background: transparent;
  border: 1px solid var(--main-purple);
  border-radius: 3px;
  font-size: 1rem;
  padding: 0.1rem 0.3rem;
}

.label {
  color: var(--main-font-color);
}

.input::placeholder {
  color: var(--placeholder-font-color);
  font-size: 0.8rem;
}

.darkThemeInput {
  border: 1px solid #ffffff;
  color: var(--dark-theme-font-color);
}

.darkThemeLabel,
.darkThemeInput::placeholder {
  color: var(--dark-theme-font-color);
}
</style>
