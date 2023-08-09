<template>
  <component :is="as" type="button" class="button" :class="classes" :disabled="disabled">
    <slot /> {{ label }}
  </component>
</template>
<script lang="ts">
import { type ButtonClasses } from '@/types/types';

export default {
  props: {
    label: { type: String, default: '' },
    dark: { type: Boolean, default: false },
    size: { type: String, default: 'small' },
    rounded: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
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
  padding: 0.5em 1em;
  font-family: Arial, Helvetica, sans-serif;
  border: solid 1px transparent;
  border-radius: 4px;
  transition: 0.3s;
  cursor: pointer;
}
.size-medium {
  font-size: medium;
}
.size-large {
  font-size: large;
}
.size-small {
  font-size: small;
}
.theme-dark {
  background: #4528a4;
  color: #fff;
  border: solid 1px #4528a4;
  &:not(:disabled):hover {
    border: solid 1px #3f2496;
    color: #d6cbf8;
    background: #3f2496;
  }
  &:not(:disabled):active,
  &.active {
    border: solid 1px #2f1b70;
    background: #2f1b70;
  }
}
.theme-light {
  background: #fff;
  color: #4a4a4a;
  border: solid 1px #eee;
  &:not(:disabled):hover {
    color: #4a4a4a;
    border: solid 1px #eee;
    background: #eee;
  }
  &:not(:disabled):active,
  &.active {
    border: solid 1px #d7d7d7;
    background: #d7d7d7;
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
