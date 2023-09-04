<template>
  <div class="input-block" :style="{ width: width }">
    <label v-if="label" :for="id" class="label" :class="{ 'dark-theme-label': isDark }">{{
      label
    }}</label>
    <input
      :id="id"
      ref="input"
      v-model.trim="inputValue"
      :type="type"
      :placeholder="name ? name : ''"
      class="input"
      :class="{
        'dark-theme-input': isDark,
        'valid-focus-decorator': valid === 'valid',
        'invalid-focus-decorator': valid === 'invalid',
      }"
      :disabled="disabled"
      :max="max" />
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
  props: {
    label: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
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
    max: {
      type: String,
      default: '',
    },
  },
  data(): { inputValue: string } {
    return {
      inputValue: '',
    };
  },
};
</script>

<style scoped>
.input-block {
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: var(--main-font-style);
  gap: 0.5rem;
  font-size: 1rem;
  height: fit-content;
}

.input {
  background: transparent;
  border: 1.5px solid var(--main-color-outline);
  font-size: 1rem;
  outline: none;
  height: 2.2rem;
  border-radius: 10px;
  padding: 0.1rem 1.2rem;
}

.label {
  color: var(--main-font-color);
  font-size: 16px;
  font-weight: 500;
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

.dark-theme-label,
.dark-theme-input::placeholder {
  color: var(--dark-theme-font-color);
}

.input-icon {
  position: absolute;
  cursor: pointer;
  bottom: 1.3rem;
  right: 1rem;
  transform: translateY(50%);
  fill: #5e5163;
  height: 1.4rem;
}
</style>
