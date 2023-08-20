<template>
  <div :class="getBurgerClass">
    <div :class="getBarClass" />
    <div v-if="!open" class="burger-line" />
    <div :class="getBarClass" />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getBurgerClass(): string {
      return this.open ? 'burger-closed' : 'burger';
    },
    getBarClass(): string {
      return this.open ? 'close-line' : 'burger-line';
    },
  },
};
</script>

<style scoped>
.burger,
.burger-closed {
  cursor: pointer;
  position: relative;
  margin: 0 0.5rem;
  width: 30px;
  z-index: 5;
  transition: 0.3s;
}
.burger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 22px;
}
.burger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--main-color);
}

.burger-closed {
  display: block;
  height: 30px;
  top: 5%;
}

.close-line {
  background-color: var(--main-color);
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
  position: relative;
}

.close-line:first-child {
  transform: translateY(500%) rotate(45deg);
}

.close-line:last-child {
  transform: translateY(400%) rotate(-45deg);
}
</style>
