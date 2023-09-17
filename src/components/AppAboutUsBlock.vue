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
          alt="Coracao photo" />
      </div>
      <h4 class="member-name">{{ member.name }}</h4>
      <p class="member-role">{{ member.role }}</p>
      <a class="member-gh" :href="member.ghLink">{{ member.ghNick }}</a>
      <p class="about-member">{{ member.bio }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import coracao from '@/assets/images/coracao.png';
import photo from '@/assets/images/member-photo.png';
import { Roles, Names, GHNicks, GHLinks, Bios } from '@/types/enums';
import { type AboutUsBlock } from '@/types/types';

export default {
  data(): AboutUsBlock {
    return {
      members: [
        {
          image: photo,
          name: Names.Wystov,
          role: Roles.Wystov,
          ghNick: GHNicks.Wystov,
          ghLink: GHLinks.Wystov,
          bio: Bios.Wystov,
        },
        {
          image: photo,
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
}
.about-member {
  text-align: justify;
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
