<template>
  <div class="container">
    <Controls
      :finished="finished"
      :started="started"
      :turns="turns"
      :min="min"
      :sec="sec"
      @reset-game="resetGame()"
    />
    <div class="board mx-auto">
      <Card
        v-for="card in memoryCards"
        :key="card.name"
        :card="card"
        @click="flipCard(card)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Card from './components/Card.vue';
import Controls from './components/Controls.vue';
import shuffle from 'lodash/shuffle';
import cloneDeep from 'lodash/cloneDeep';

export interface Card {
  name: string;
  img: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameData {
  cards: Card[];
  memoryCards: Card[];
  flippedCards: Card[];
  finished: boolean;
  started: boolean;
  turns: number;
  totalTime: {
      minutes: number;
      seconds: number;
  };
  interval: ReturnType<typeof setInterval>
}

export default defineComponent({
  name: 'App',
  components: {
    Card,
    Controls,
  },
  data(): GameData {
    return {
      cards: [
        {
          name: 'Flutter',
          img: 'Flutter.svg',
          isFlipped: false,
          isMatched: false,
        },
        {
          name: 'Golang',
          img: 'Golang.svg',
          isFlipped: false,
          isMatched: false,
        },
        {
          name: 'Firebase',
          img: 'Firebase.svg',
          isFlipped: false,
          isMatched: false,
        },
        {
          name: 'Kotlin',
          img: 'Kotlin.svg',
          isFlipped: false,
          isMatched: false,
        },
        {
          name: 'ElasticSearch',
          img: 'ElasticSearch.svg',
          isFlipped: false,
          isMatched: false,
        },
        {
          name: 'Vue',
          img: 'Vue.svg',
          isFlipped: false,
          isMatched: false,
        },
      ],
      memoryCards: [],
      flippedCards: [],
      finished: false,
      started: false,
      turns: 0,
      totalTime: {
        minutes: 0,
        seconds: 0,
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      interval: setTimeout(function() {}, 100),
    };
  },
  computed: {
    sec(): string {
      if (this.totalTime.seconds < 10) {
        return '0' + this.totalTime.seconds;
      }

      return this.totalTime.seconds.toString();
    },
    min(): string {
      if (this.totalTime.minutes < 10) {
        return '0' + this.totalTime.minutes;
      }

      return this.totalTime.minutes.toString();
    },
  },
  created() {
    this.initMemoryCards();
  },
  beforeUnmount() {
    // Arrêter le chronomètre
    clearInterval(this.interval);
  },
  methods: {
    flipCard(newlyFlippedCard: Card) {
      if (
        newlyFlippedCard.isMatched ||
        newlyFlippedCard.isFlipped ||
        this.flippedCards.length === 2
      ) {
        // Ne plus retourner les cartes
        return;
      }

      if (!this.started) {
        // Démarrer le chronomètre
        this.startGame();
      }

      // Mettre à jour isFlipped = true pour newlyFlippedCard
      this.memoryCards = this.memoryCards.map(memoryCard => {
        if (memoryCard.name === newlyFlippedCard.name) {
          return {
            ...memoryCard,
            isFlipped: true,
          };
        } else {
          return memoryCard;
        }
      });

      // Mise à jour de this.flippedCards
      if(this.flippedCards.length < 2) {
        this.flippedCards = [
          ...this.flippedCards,
          newlyFlippedCard
        ];
      }
      if(this.flippedCards.length === 2) {
        this.matchCards();
      }
    },
    matchCards() {
      // Mise à jour du nombre de tours joués
      this.turns ++;

      if(this.flippedCards[0].name.slice(0, -2) === this.flippedCards[1].name.slice(0, -2)) {
        // Apparier les cartes `this.flippedCards` très tôt (250 ms) pour ne plus les retourner
        // voir this.flipCard
        setTimeout(() => {
          // Mettre à jour isMatched = true pour les cartes appariées
          this.memoryCards = this.memoryCards.map(card => {
            if (card.name.slice(0, -2) === this.flippedCards[0].name.slice(0, -2)) {
              return {
                ...card,
                isMatched: true,
              };
            } else {
              return card;
            }
          });

          this.flippedCards = [];

          const areAllMemoryCardsMatched = this.memoryCards.every(
            card => card.isMatched === true
          );
          if (areAllMemoryCardsMatched) {
            // Arrêter le chronomètre
            clearInterval(this.interval);
            // Partie terminée
            this.finished = true;
          }
        }, 400);
      } else {
        // Retourner les cartes `this.flippedCards` après avoir révélé this.flippedCards[1]
        setTimeout(() => {
          // Mettre à jour isFlipped = false pour les 2 cartes différentes
          this.memoryCards = this.memoryCards.map(memoryCard => {
            const isMemoryCardUnmatched = this.flippedCards.some(
              flippedCard => memoryCard.name.slice(0, -2) === flippedCard.name.slice(0, -2)
            );
            if (isMemoryCardUnmatched) {
              return {
                ...memoryCard,
                isFlipped: false,
              };
            } else {
              return memoryCard;
            }
          });

          this.flippedCards = [];
        }, 800);
      }
    },
    initMemoryCards() {
      this.memoryCards = shuffle(
        [
          ...cloneDeep(this.cards.map(
            // Pour que les card.name soient uniques dans this.memoryCards
            card => ({ ...card, name: `${card.name}-1` })
          )),
          ...cloneDeep(this.cards.map(
            // Pour que les card.name soient uniques dans this.memoryCards
            card => ({ ...card, name: `${card.name}-2` })
          )),
        ]
      );
    },
    startGame() {
      this.tick();
      this.interval = setInterval(this.tick, 1000);

      this.started = true;
    },
    tick() {
      if (this.totalTime.seconds !== 59) {
        this.totalTime.seconds ++;
        return;
      }

      this.totalTime.minutes ++;
      this.totalTime.seconds = 0;
    },
    resetGame() {
      clearInterval(this.interval);

      // Remettre isFlipped = false et isMatched = false
      // pour toutes les cartes
      this.memoryCards = this.memoryCards.map(memoryCard => {
        return {
          ...memoryCard,
          isFlipped: false,
          isMatched: false,
        };
      });

      setTimeout(() => {
        this.initMemoryCards();
        this.totalTime.minutes = 0;
        this.totalTime.seconds = 0;
        this.started = false;
        this.finished = false;
        this.turns = 0;
        this.flippedCards = [];
      }, 600);
    },
  },
});
</script>

<style lang="scss">
.board {

  margin-top: 40px;

  display: grid;
  grid-template-columns: repeat(2, auto);

  gap: 20px;

  justify-content: center;
}
@media screen and (min-width: 360px) {
  .board {
    grid-template-columns: repeat(3, auto);
  }
}
@media screen and (min-width: 576px) {
  .board {
    grid-template-columns: repeat(4, auto);

    gap: 40px;
  }
}
@media screen and (min-width: 992px) {
  .board {
    grid-template-columns: repeat(6, auto);
  }
}
</style>
