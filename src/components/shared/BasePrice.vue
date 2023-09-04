<template>
  <div
    :style="{ fontSize: size + 'px' }"
    class="price"
    :class="classes">
    <span class="currency-symbol">{{ symbol }}</span>
    <span class="price-value">{{ price }}</span>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    price: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
    symbol: {
      type: String,
      required: true,
    },
    discounted: {
      type: Boolean,
      default: false,
    },
    strikethrough: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes(): { discounted: boolean; strikethrough: boolean } {
      return {
        discounted: this.discounted,
        strikethrough: this.strikethrough,
      };
    },
  },
};
</script>
<style scoped>
.price {
  display: flex;
  position: relative;
  width: fit-content;
  justify-content: center;
  align-items: flex-start;
}
.currency-symbol {
  position: absolute;
  left: -0.6em;
  top: 0;
  font-size: 0.6em;
  font-weight: 600;
}
.price-value {
  font-weight: 600;
}
.price.discounted {
  color: var(--main-color);
  .price-value,
  .currency-symbol {
    color: var(--main-color);
  }
}
.price.strikethrough {
  text-decoration: line-through;
  opacity: 0.8;
}
</style>
