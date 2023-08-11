<template>
  <div class="navigation">
    <ul class="navigation-list">
      <li class="navigation-link" v-for="(page, i) in navigation" :key="i">
        <BaseButton dark rounded @click="$router.push({ name: page })">{{ page }}</BaseButton>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { NamePages } from '@/types/enums';
import { type DataNavigation } from '@/types/types';
import BaseButton from '@/components/shared/BaseButton.vue';

export default {
  components: {
    BaseButton,
  },
  data(): DataNavigation {
    const { Home, AboutUs, Catalog } = NamePages;
    return { navigation: [Home, AboutUs, Catalog] };
  },
};
</script>
<style scoped>
.navigation {
  display: flex;
}
.navigation-list {
  display: flex;
  gap: 0.2em;
}
.navigation-link {
  display: flex;
}
</style>
