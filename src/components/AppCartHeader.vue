<template>
  <div class="top-container">
    <h1>Cart ({{ products.length }})</h1>
    <BaseButton
      class="clear-cart-button"
      size="small"
      @click="showModal = true">
      Clear Shopping Cart
    </BaseButton>
  </div>
  <BasePopup
    :show="showModal"
    @close="showModal = false">
    <div class="popup-container">
      <h3>Are you sure?</h3>
      <p>This will clear all items from your cart.</p>
      <BaseButton
        class="medium"
        @click="removeCartCloseModal">
        Clear cart
      </BaseButton>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { mapState, mapActions } from 'pinia';
import { useCartStore } from '@/stores/cart';
import BaseButton from '@/components/shared/BaseButton.vue';
import BasePopup from '@/components/shared/BasePopup.vue';

export default {
  components: {
    BaseButton,
    BasePopup,
  },
  data(): { showModal: boolean } {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ['products']),
  },
  methods: {
    ...mapActions(useCartStore, ['removeCart']),
    async removeCartCloseModal(): Promise<void> {
      this.showModal = false;
      this.removeCart();
    },
  },
};
</script>

<style scoped>
.top-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-container .clear-cart-button {
  background: white;
  color: var(--main-font-color);
  font-size: 0.9rem;
  border: 1.5px solid var(--main-font-color);

  &:hover {
    border: 1.5px solid transparent;
  }
}
.popup-container {
  display: grid;
  place-items: center;
  row-gap: 2rem;
  padding: 2rem;
}
</style>
