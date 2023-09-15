<template>
  <div class="members">
    <div
      v-for="(member, i) in members"
      :key="i"
      class="member-block">
      <div class="member-photo">
        <img
          :src="members[0].image"
          class="image"
          alt="Coracao photo" />
      </div>
      <h4 class="member-name">{{ member.name }}</h4>
      <p class="member-role">{{ member.role }}</p>
      <p class="member-gh">{{ member.ghNick }}</p>
      <p class="about-member">{{ member.bio }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import coracao from '@/assets/images/coracao.png';
import { Roles, Names, GHNicks } from '@/types/enums';
import { type AboutUsBlock } from '@/types/types';

export default {
  data(): AboutUsBlock {
    return {
      members: [
        {
          image: coracao,
          name: Names.Wystov,
          role: Roles.Wystov,
          ghNick: GHNicks.Wystov,
          bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia saepe accusamus iusto! Laudantium numquam, minima dolore fugit doloremque labore fuga enim veniam saepe possimus animi praesentium delectus iste quae culpa?',
        },
        {
          image: coracao,
          name: Names.Duxcoder,
          role: Roles.Duxcoder,
          ghNick: GHNicks.Duxcoder,
          bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia saepe accusamus iusto! Laudantium numquam, minima dolore fugit doloremque labore fuga enim veniam saepe possimus animi praesentium delectus iste quae culpa?',
        },
        {
          image: coracao,
          name: Names.Coracao,
          role: Roles.Coracao,
          ghNick: GHNicks.Coracao,
          bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia saepe accusamus iusto! Laudantium numquam, minima dolore fugit doloremque labore fuga enim veniam saepe possimus animi praesentium delectus iste quae culpa?',
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
  padding: 0 3%;
  gap: 1rem;
}
.member-photo {
  width: 60%;
  border-radius: 50%;
  overflow: hidden;
}
.image {
  width: 100%;
}
</style>
