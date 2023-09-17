<template>
  <div class="cart-info">
    <template v-if="!promocodeId.length">
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
    </template>
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
    <span class="info-total">Delivery: free</span>
    <div
      v-if="promocodeId.length"
      class="promo-info-container">
      <span class="info-total"> Promocode: {{ promocodeValue }} </span>
      <TrashIcon
        class="remove-promocode-btn"
        @click="removePromocode" />
    </div>
    <span class="info-total bold">Total: {{ totalPrice }}</span>
    <BaseButton
      size="medium"
      class="checkout-btn">
      Check out
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { TrashIcon } from '@heroicons/vue/24/outline';
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
    TrashIcon,
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
      promoAlertTimeout: null,
    };
  },
  computed: {
    ...mapState(useCartStore, ['promocodeId']),
  },
  methods: {
    ...mapActions(useCartStore, ['applyPromo', 'removePromocode']),
    async submitPromo(): Promise<void> {
      const input = this.$refs.promoInput as BaseInputType;
      const code = input.inputValue.trim();
      if (!code.length) return;
      if (this.promoAlertTimeout) clearTimeout(this.promoAlertTimeout);
      try {
        await this.applyPromo(code);
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
  box-sizing: border-box;
  width: 300px;
  padding: 1rem;
  border: 1px solid #e9e9e9;
  border-radius: 10px;

  @media (max-width: 1000px) {
    width: 100%;
  }
}
.info-title {
  font-weight: 600;
}
.info-total {
  display: block;
  margin-bottom: 1rem;
}
.bold {
  font-weight: 600;
}
.promo-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
.remove-promocode-btn {
  cursor: pointer;
  color: #3a3e3f;
  height: 1.2rem;
  transition: 0.3s;

  @media (hover: hover) {
    opacity: 0;
  }
}
.promo-info-container {
  display: flex;
  gap: 2rem;

  @media (hover: hover) {
    &:hover .remove-promocode-btn {
      opacity: 1;
    }
  }
}
.checkout-btn {
  padding: 10px 20px;
}
</style>
