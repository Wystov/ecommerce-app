<template>
  <div class="input-block" :style="{ width: width }">
    <label for="input-field" class="label" :class="{ 'dark-theme-label': isDark }" v-if="label">{{
      label
    }}</label>
    <input
      :type="type"
      :id="id"
      :placeholder="name ? name : ''"
      v-model.trim="inputValue"
      class="input"
      :class="{
        'dark-theme-input': isDark,
        'valid-focus-decorator': valid === 'valid',
        'invalid-focus-decorator': valid === 'invalid',
      }"
      :disabled="disabled"
      ref="input"
    />
    <EyeIcon v-if="hidePass === 'show'" class="input-icon" />
    <EyeSlashIcon v-if="hidePass === 'hide'" class="input-icon" />
  </div>
</template>

<script lang="ts">
import '../../assets/styles/style.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid';

export default {
  components: {
    EyeIcon,
    EyeSlashIcon,
  },
  data(): { inputValue: string } {
    return {
      inputValue: '',
    };
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    id: {
      type: String,
      required: true,
    },
    isDark: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '100%',
    },
    valid: {
      type: String,
      default: '',
    },
    hidePass: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
.input-block {
  display: flex;
  flex-direction: column;
  font-family: var(--main-font-style);
  gap: 0.5rem;
  font-size: 1rem;
  height: fit-content;
  position: relative;
}

.input {
  background: transparent;
  border: 1.5px solid var(--main-color-outline);
  border-radius: 3px;
  font-size: 1rem;
  padding: 0.1rem 0.3rem;
  outline: none;
}

.label {
  color: var(--main-font-color);
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

.dark-theme-label,
.dark-theme-input::placeholder {
  color: var(--dark-theme-font-color);
}

.input-icon {
  position: absolute;
  bottom: 0.8rem;
  right: 0.3rem;
  transform: translateY(50%);
  fill: #5e5163;
  height: 1em;
}
</style>
