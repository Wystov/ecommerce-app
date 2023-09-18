<template>
  <div class="wrapper">
    <h1 class="title">The Promise Team</h1>
    <div class="logo-block">
      <h4 class="logo-text">From</h4>
      <a
        class="logo"
        href="https://rs.school">
        <img
          :src="SchoolLogo"
          class="logo"
          alt="RS school logo" />
      </a>
    </div>
    <p class="team-description">
      The Promise team was founded in July 2023 by a happy coincidence and matched point of view of
      future team members on the development process.<br />
      Our motto - We return the promise to release a top project. But promise can be rejected.<br />
      Was it resolved? Well, you can decide for yourself.
    </p>
    <AboutUsBlock />
  </div>
</template>

<script lang="ts">
import AboutUsBlock from '@/components/AppAboutUsBlock.vue';
import SchoolLogo from '@/assets/icons/rs_school.svg';

export default {
  components: {
    AboutUsBlock,
  },
  data(): { SchoolLogo: string } {
    return {
      SchoolLogo,
    };
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.title {
  margin: 0;
}
.team-description {
  text-align: center;
}
.logo-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 60px;
}
.logo-text {
  font-weight: 600;
}
</style>
