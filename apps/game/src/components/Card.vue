<template>
  <div
    class="card"
    :class="{ 'flipped': card.isFlipped, 'matched': card.isMatched }"
  >
  <div
    class="card-inner"
  >
    <div
      class="front border rounded shadow p-2 d-flex flex-nowrap justify-content-center align-items-center"
    >
      <img
        width="100"
        height="150"
        src="../assets/images/memorycard/pattern.jpg"
      >
    </div>
    <div class="back rounded border p-2 d-flex flex-nowrap justify-content-center align-items-center">
      <img
        width="80"
        height="130"
        :src="backImgSrc"
      >
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import { Card } from '../App.vue';

// https://stackoverflow.com/a/35961176
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare var require: any;

export default defineComponent({
  name: 'Card',
  props: {
    card: {
      type: Object as PropType<Card>,
      // Bien utiliser des arrow functions
      default: () => ({
        name: '',
        img: '',
      }),
      required: true,
    },
  },
  data() {
    return {
      backImgSrc: require(`../assets/images/memorycard/${this.card.img}`),
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// https://www.w3schools.com/howto/howto_css_flip_card.asp
.card {
  background-color: transparent;
  width: 100px;
  height: 150px;
  perspective: 1000px;
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 250ms;
  transform-style: preserve-3d;
}
.card.flipped .card-inner {
  transform: rotateY(180deg);
}
.matched {
  opacity: 0.3;
}
.front, .back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.back {
  transform: rotateY(180deg);
}
</style>
