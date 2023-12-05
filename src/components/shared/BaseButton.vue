<template>
  <component
    :is="as"
    type="button"
    class="button"
    :class="classes"
    :disabled="disabled">
    <slot /> {{ label }}
  </component>
</template>
<script lang="ts">
import { type ButtonClasses } from '@/types/types';

export default {
  props: {
    label: { type: String, default: '' },
    dark: { type: Boolean, default: false },
    size: { type: String, default: 'medium' },
    rounded: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    as: { type: String, default: 'button' },
  },
  computed: {
    classes(): ButtonClasses {
      return {
        'theme-dark': this.dark,
        'theme-light': !this.dark,
        'size-small': this.size === 'small',
        'size-medium': this.size === 'medium',
        'size-large': this.size === 'large',
        link: this.as === 'a',
        rounded: this.rounded,
        circle: this.circle,
        active: this.active,
        disabled: this.disabled,
        outline: this.outline,
      };
    },
  },
};
</script>
<style scoped>
.button {
  height: min-content;
  display: inline-flex;
  gap: 0.2em;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 4em;
  border: solid 2px transparent;
  border-radius: 10px;
  transition: 0.3s;
  cursor: pointer;
}

.size-large {
  font-size: 30px;
  padding: 15px 30px;
}

.size-medium {
  font-size: 18px;
  padding: 15px 30px;
}

.size-small {
  font-size: 12px;
  padding: 10px 20px;
}

.theme-dark {
  background: #2f8a3a;
  color: #fff;
  border: solid 1px #2f8a3a;

  &:not(:disabled):hover {
    border: solid 1px #21762b;
    color: #d6cbf8;
    background: #21762b;
  }

  &:not(:disabled):active,
  &.active {
    border: solid 1px #186320;
    background: #186320;
  }
}

.theme-light {
  background: var(--main-color);
  color: #fff;

  &:not(:disabled):hover {
    color: var(--main-font-hover);
    background: var(--main-color-hover);
  }

  &:not(:disabled):active,
  &.active {
    background: var(--main-color-active);
  }
}

.theme-light.outline {
  background: transparent;
  color: var(--main-font-color);
  border: 2px solid var(--main-font-color);
  &:not(:disabled):hover {
    border: 2px solid var(--main-color-hover);
    color: var(--main-color);
    background: #fff;
  }

  &:not(:disabled):active,
  &.active {
    color: var(--main-color-active);
    border: 2px solid var(--main-color-active);
  }
}

.rounded {
  border-radius: 1em;
}

.circle {
  border-radius: 50%;
  padding: 0.5em;
  min-width: 0;
  width: 2.5em;
  height: 2.5em;
}

.disabled {
  filter: contrast(0.6);
  cursor: no-drop;
}

.link {
  text-decoration: none;
}
</style>
