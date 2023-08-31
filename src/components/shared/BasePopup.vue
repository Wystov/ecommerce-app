<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper" @click.self="$emit('close')" @keydown.delete="$emit('close')">
        <div class="modal-container" :class="className">
          <BaseButton
            size="large"
            circle
            :class="closeIn ? 'close-btn-in' : 'close-btn'"
            @click="$emit('close')"
          ><XMarkIcon class="close-icon"
          /></BaseButton>
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { XMarkIcon } from '@heroicons/vue/20/solid';
import BaseButton from '@/components/shared/BaseButton.vue';

export default {
  components: {
    BaseButton,
    XMarkIcon,
  },
  props: {
    show: { type: Boolean, default: false },
    className: { type: String, default: 'popup-default' },
    closeIn: { type: Boolean, default: false },
  },
  watch: {
    show(): void {
      if (this.show) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
  },
  mounted(): void {
    document.addEventListener('keydown', (e) => {
      if (this.show && e.key === 'Escape') {
        this.$emit('close');
      }
    });
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  position: relative;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}
.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.close-btn {
  z-index: 22;
  position: absolute;
  right: -1em;
  top: -1em;
}
.close-btn-in {
  z-index: 22;
  position: absolute;
  right: 0.5em;
  top: 0.5em;
}
.close-icon * {
  color: #fff;
  width: 100%;
}
.popup-default {
  width: min(70vh, 70vw);
}
@media (max-width: 900px) {
  .popup-default {
    width: min(80vh, 80vw);
  }
}
@media (max-width: 768px) {
  .popup-default {
    width: min(90vh, 90vw);
  }
  .close-btn {
    z-index: 22;
    position: absolute;
    right: 0.5em;
    top: 0.5em;
  }
}
@media (max-width: 500px) {
  .popup-default {
    width: min(95vh, 95vw);
  }
  .close-btn {
    z-index: 22;
    position: absolute;
    right: 0.5em;
    top: 0.5em;
  }
}
</style>
