<template>
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
      <BaseButton label="Update info" />
      <BaseButton label="Change password" />
      <div class="divider-final" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { useUserStore } from '@/stores/user';
import BaseButton from '@/components/shared/BaseButton.vue';
import type { AccountInfoData } from '@/types/types';
import api from '@/utils/api/client';

export default {
  components: {
    BaseButton,
  },
  data(): AccountInfoData {
    return {
      name: '',
      surname: '',
      date: '',
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

@media(max-width: 550px) {
  .buttons-block :deep(.button) {
    padding: 15px 13px;
  }
}
</style>
