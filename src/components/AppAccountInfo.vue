<template>
  <div class="popup-container">
    <BasePopup
      :show="showPopup === true"
      :closeOnDelete="false"
      @close="closePopup">
      <div v-if="updateInfo === true">
        <h3>Please fill only the fields you want to change and press "Update" button:</h3>
        <EditInfoBlock />
      </div>
      <div v-if="updateInfo === false"> <EditPassBlock /></div>
    </BasePopup>
  </div>
  <div class="info-container">
    <div class="info-block">
      <span class="content-name">First name</span>
      <span class="content">{{ firstName }}</span>
      <span class="content-name">Last Name</span>
      <span class="content">{{ lastName }}</span>
      <span class="content-name">Date of birth</span>
      <span class="content">{{ birthDate }}</span>
    </div>
    <div class="buttons-block">
      <BaseButton label="Update info" @click="openInfoPopup" />
      <BaseButton label="Change password" @click="openPasswordPopup" />
      <div class="divider-final" />
    </div>
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
import api from '@/utils/api/client';

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
    firstName(): string {
      return this.name ?? '';
    },
    lastName(): string {
      return this.surname ?? '';
    },
    birthDate(): string {
      return this.date ?? '';
    },
  },
  methods: {
    async getData(): Promise<void> {
      try {
        const { body } = await api.call().me().get().execute();
        this.name = body.firstName;
        this.surname = body.lastName;
        this.date = body.dateOfBirth;
      } catch (error) {
        console.error('Error:', error);
      }
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
    },
  },
  created(): void {
    this.getData();
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

@media(max-width: 550px) {
  .buttons-block :deep(.button) {
    padding: 15px 13px;
  }
}
</style>
