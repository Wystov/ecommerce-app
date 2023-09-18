<template>
  <div class="members">
    <div
      v-for="(member, i) in members"
      :key="i"
      class="member-block">
      <div class="member-photo">
        <img
          :src="members[i].image"
          class="image"
          alt="Team member photo" />
      </div>
      <h4 class="member-name">{{ member.name }}</h4>
      <p class="member-role">{{ member.role }}</p>
      <a class="member-gh" target="_blank" rel="noopener noreferrer" :href="member.ghLink">{{ member.ghNick }}</a>
      <p class="about-member">{{ member.bio }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import coracao from '@/assets/images/coracao.jpg';
import wystov from '@/assets/images/wystov.jpg';
import duxcoder from '@/assets/images/duxcoder.jpg';
import { Roles, Names, GHNicks, GHLinks, Bios } from '@/types/enums';
import { type AboutUsBlock } from '@/types/types';

export default {
  data(): AboutUsBlock {
    return {
      members: [
        {
          image: wystov,
          name: Names.Wystov,
          role: Roles.Wystov,
          ghNick: GHNicks.Wystov,
          ghLink: GHLinks.Wystov,
          bio: Bios.Wystov,
        },
        {
          image: duxcoder,
          name: Names.Duxcoder,
          role: Roles.Duxcoder,
          ghNick: GHNicks.Duxcoder,
          ghLink: GHLinks.Duxcoder,
          bio: Bios.Duxcoder,
        },
        {
          image: coracao,
          name: Names.Coracao,
          role: Roles.Coracao,
          ghNick: GHNicks.Coracao,
          ghLink: GHLinks.Coracao,
          bio: Bios.Coracao,
        },
      ],
    };
  },
};
</script>

<style scoped>
.members {
  display: flex;
}
.member-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2%;
  gap: 0.7rem;
  width: 30%;
}
.member-photo {
  width: 40%;
  border-radius: 50%;
  overflow: hidden;
}
.image {
  width: 100%;
  height: 100%;
}
.member-name {
  font-size: 1.2rem;
  font-weight: 600;
}
.member-role {
  font-size: 1.2rem;
}
.member-gh {
  text-decoration: none;
  color: var(--main-color);
}
.member-gh:hover {
font-weight: 600;
}
.about-member {
  text-align: justify;
  font-size: 0.9rem;
}
@media (max-width: 1100px) {
  .member-photo {
    width: 60%;
  }
}
@media (max-width: 900px) {
  .members {
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
  }
  .member-block {
    width: 90%;
  }
  .member-photo {
    width: 30%;
  }
}
@media (max-width: 600px) {
  .member-block {
    width: 100%;
    padding: 0;
  }
  .member-photo {
    width: 40%;
  }
}
</style>
