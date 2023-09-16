<template>
  <div class="cart-info">
    <span class="info-title">Promocode</span>
    <div class="promo-container">
      <BaseInput
        id="promocode"
        ref="promoInput"
        width="75%"
        @keyup.enter="submitPromo" />
      <BaseButton
        size="small"
        class="promocode-btn"
        @click="submitPromo">
        Apply
      </BaseButton>
    </div>
    <Transition>
      <BaseMessage
        v-if="showPromoAlert"
        absolute
        arrow="top"
        alert="danger">
        {{ promoAlertMessage }}
      </BaseMessage>
    </Transition>
    <span class="info-total">Subtotal: {{ cartSubtotal }}</span>
    <span class="info-total">Promocode: {{ promocodeValue }}</span>
    <span class="info-total">Total: {{ totalPrice }}</span>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'pinia';
import { useCartStore } from '@/stores/cart';
import type { BaseInputType, CartInfo } from '@/types/types';
import BaseInput from './shared/BaseInput.vue';
import BaseMessage from './shared/BaseMessage.vue';
import BaseButton from './shared/BaseButton.vue';

export default {
  components: {
    BaseInput,
    BaseMessage,
    BaseButton,
  },
  props: {
    cartSubtotal: {
      type: String,
      required: true,
    },
    promocodeValue: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
  },
  data(): CartInfo {
    return {
      showPromoAlert: false,
      promoAlertMessage: '',
      promoApplied: false,
      promoAlertTimeout: null,
    };
  },
  methods: {
    ...mapActions(useCartStore, ['applyPromo']),
    async submitPromo(): Promise<void> {
      const input = this.$refs.promoInput as BaseInputType;
      const code = input.inputValue.trim();
      if (!code.length) return;
      if (this.promoAlertTimeout) clearTimeout(this.promoAlertTimeout);
      try {
        await this.applyPromo(code);
        this.promoApplied = true;
      } catch (error) {
        this.promoAlertMessage = (error as Error).message;
        this.showPromoAlert = true;
        this.promoAlertTimeout = window.setTimeout(() => {
          this.showPromoAlert = false;
        }, 5000);
      } finally {
        input.inputValue = '';
      }
    },
  },
};
</script>

<style scoped>
.cart-info {
  width: 300px;
  padding: 1rem;
  border: 1px solid #e9e9e9;
  border-radius: 10px;
}
.info-title {
  font-weight: 600;
}
.info-total {
  display: block;
  margin-bottom: 1rem;
}
.promo-container {
  display: flex;
  gap: 0.5rem;
}
</style>
