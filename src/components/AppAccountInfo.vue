<template>
  <div class="info-container">
    <div class="info-block">
      <span class="content-name">First name</span>
      <span class="content">{{ name }}</span>
      <span class="content-name">Last Name</span>
      <span class="content">{{ surname }}</span>
      <span class="content-name">Date of birth</span>
      <span class="content">{{ date }}</span>
    </div>
    <div class="buttons-block">
      <BaseButton label="Update info" @click="openInfoPopup" />
      <BaseButton label="Change password" @click="openPasswordPopup" />
      <div class="divider-final" />
    </div>
  </div>
  <div class="popup-container">
    <BasePopup
      :show="showPopup === true"
      :closeOnDelete="false"
      @close="closePopup">
      <div v-if="updateInfo === true">
        <h3 class="info-edit-header">Please fill only the fields you want to change and press "Update" button:</h3>
        <EditInfoBlock @close="closePopup" />
      </div>
      <div v-if="updateInfo === false">
        <EditPassBlock @close="closePopup" />
      </div>
    </BasePopup>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import BasePopup from '@/components/shared/BasePopup.vue';
import EditInfoBlock from '@/components/AppEditInfoBlock.vue';
import EditPassBlock from '@/components/AppEditPassBlock.vue';
import type { AccountInfoData } from '@/types/types';

export default {
  components: {
    BaseButton,
    BasePopup,
    EditInfoBlock,
    EditPassBlock,
  },
  data(): AccountInfoData {
    return {
      name: '',
      surname: '',
      date: '',
      showPopup: false,
      updateInfo: true,
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    updateNames(): void {
      this.name = this.userStore.customerData.body.firstName;
      this.surname = this.userStore.customerData.body.lastName;
      this.date = this.userStore.customerData.body.dateOfBirth;
    },
    openInfoPopup(): void {
      this.showPopup = true;
      this.updateInfo = true;
    },
    openPasswordPopup(): void {
      this.showPopup = true;
      this.updateInfo = false;
    },
    closePopup(): void {
      this.showPopup = false;
      this.updateNames();
    },
  },
  created(): void {
    this.userStore.getData();
    this.updateNames();
  },
};
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.info-block {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  align-items: end;
  gap: 3rem;
}
.content-name {
  width: fit-content;
  font-weight: 500;
}
.buttons-block {
  display: grid;
  grid-template-areas: "button button" "divider divider";
  gap: 2rem;
}
.buttons-block :deep(.button) {
  background-color: transparent;
  color: var(--main-font-color);
  border: 1.5px solid var(--main-font-color);
}
.buttons-block :deep(.button:hover) {
  border-color: var(--main-color);
}
.divider-final {
  width: 100%;
  border: 0.75px solid var(--main-font-color);
  grid-area: divider;
}

.popup-container :deep(.modal-container) {
  padding: 20px;
}

.popup-container :deep(.button:not(.circle)) {
  margin-top: 20px;
}
.popup-container :deep(.edit-form) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}
@media(max-width: 768px) {
  .popup-container :deep(.circle) {
    width: 50px;
    height: 50px;
    right: 0.5em;
    top: 0.5em;
  }
  .info-edit-header {
    width: 90%;
  }
}
@media(max-width: 550px) {
  .popup-container :deep(.popup-default) {
    width: min(90vh, 90vw);
  }
  .info-edit-header {
    width: 87%;
    font-size: 1.2rem;
  }
  .buttons-block :deep(.button) {
    padding: 15px 13px;
  }
  .popup-container :deep(.circle) {
    width: 40px;
    height: 40px;
    font-size: 15px;
    right: 1em;
    top: 1em;
  }
}
</style>
