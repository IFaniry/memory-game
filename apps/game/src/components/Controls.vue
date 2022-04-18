<template>
  <div class="d-flex flex-wrap justify-content-center py-3">
    <div class="turns p-3">
      <span class="btn btn-info">
        Tentatives :
        <span class="badge ml-2" :class="finished ? 'bg-success' : 'bg-light text-dark'">
          {{turns}}
        </span>
      </span>
    </div>
    <div class="totalTime p-3">
      <span class="btn btn-info">
        Temps passé :
        <span class="badge ml-2" :class="finished ? 'bg-success' : 'bg-light text-dark'">
          {{min}} : {{sec}}
        </span>
      </span>
    </div>
    <div class="totalTime p-3">
      <button
        class="btn btn-info"
        @click="reset()"
        :disabled="!started"
      >
        Recommencer
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Controls',
  props: {
    finished: {
      type: Boolean,
      // Bien utiliser des arrow functions
      default: () => false,
      required: true,
    },
    started: {
      type: Boolean,
      // Bien utiliser des arrow functions
      default: () => false,
      required: true,
    },
    turns: {
      type: Number,
      // Bien utiliser des arrow functions
      default: () => 0,
      required: true,
    },
    min: {
      type: String,
      // Bien utiliser des arrow functions
      default: () => '00',
      required: true,
    },
    sec: {
      type: String,
      // Bien utiliser des arrow functions
      default: () => '00',
      required: true,
    },
  },
  emits: ['resetGame'],
  methods: {
    reset() {
      this.$emit('resetGame');
    }
  },
});
</script>

<style scoped lang="scss"></style>
