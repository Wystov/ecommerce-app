<template>
  <div v-if="!open" class="burger">
    <div class="burger-line" />
    <div class="burger-line" />
    <div class="burger-line" />
  </div>
  <div v-if="open" class="burger-closed">
    <div class="close-line" />
    <div class="close-line" />
  </div>
</template>

<script lang="ts">
export default {
  emits: ['click'],
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.burger {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  margin: 0 0.5rem;
  width: 30px;
  height: 22px;
  z-index: 5;
  transition: 0.3s;
}
.burger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--main-color);
}

.burger-closed {
  display: block;
  cursor: pointer;
  position: relative;
  width: 30px;
  height: 30px;
  z-index: 5;
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
