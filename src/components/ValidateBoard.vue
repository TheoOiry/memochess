<template>
    <div class="restore-board">
        <div class="boards">
          <chessboard class="board" :fen="lastFen" @onMove="onBoardChange"></chessboard>
          <chessboard class="board" v-if="!isGuessingPhase" :fen="validFen"></chessboard>
        </div>
        <div v-if="isGuessingPhase">
          <input type="submit" @click="submitGuess" value="Validate" />
        </div>
        <div v-else>
          <div>Number of errors: {{ nbErrors }}</div>
          <input type="submit" @click="emitValidate" value="Continue" />
          <input type="submit" @click="endGame" value="Stop" />
        </div>
    </div>
</template>

<script>

import {chessboard} from 'vue-chessboard'
import 'vue-chessboard/dist/vue-chessboard.css'
const Chess = require('chess.js');

export default {
  name: "RestoreBoard",
  data: function () {
    return {
      actualGuessingFen: undefined,
      nbErrors: undefined,
    }
  },
  components: {
    chessboard,
  },
  props: {
    validFen: {
      type: String,
      default: undefined
    },
    lastFen: {
      type: String,
      default: undefined
    }
  },
  computed: {
    isGuessingPhase() {
      return this.nbErrors === undefined
    },
  },
  methods: {
    onBoardChange(boardInfos) {
      this.actualGuessingFen = boardInfos.fen;
      console.log(boardInfos.fen)
    },
    submitGuess() {
      this.getNbErrors()
      if(this.nbErrors === 0)
        this.emitValidate()
    },
    emitValidate() {
      this.$emit('validatesEnd', this.nbErrors)
    },
    endGame() {
      this.$emit('stopGame', this.nbErrors)
    },
    getNbErrors: function () {
      const guessedBoard = Chess(this.actualGuessingFen).board();
      const validBoard = Chess(this.validFen).board();

      let nbErrors = 0;

      for (let n = 0; n < 8; n++) {
        for (let m = 0; m < 8; m++) {

          const guessed = guessedBoard[n][m];
          const valid = validBoard[n][m];

          if ((guessed === null && valid !== null) || (guessed !== null && valid === null))
            nbErrors++;
          else if (guessed !== null && valid !== null
            && (guessed.color !== valid.color || guessed.type !== valid.type))
            nbErrors++;
        }
      }

      this.nbErrors = Math.round(nbErrors / 2);
    }
  }

}

</script>

<style scoped>
.boards {
  display: flex;
}
.boards .board {
  margin: 20px;
}
</style>
