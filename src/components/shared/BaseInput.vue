<template>
  <label for="inputField">Enter:</label>
  <input type="text" id="inputField">
  <!-- <label for="inputField">{{ labelText }}</label>
  <input v-model.trim="inputValue" type="text" id="inputField"> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseInput',
  components: {},
  data(): {} {
    return {
      inputValue: '',
      labelText: '',
    };
  },
  // props: {

  // },
});
</script>

<style></style>
