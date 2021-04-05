<template>
  <div class="home">
    <div v-if="isValidationPhase" class="restore">
      <ValidateBoard :lastFen="lastFen" :validFen="nextToFindFEN" @validatesEnd="onValidates" @stopGame="endGame"/>
    </div>
    <div v-else-if="isMemorizationPhase">
      <MemorizeMoves ref="memoMovesComponent" :movesToMemorize="currentMovesToMemorize" @endMemorizing="onEndMemorizing" />
    </div>
    <div v-else-if="isEndPhase">
      <EndResume
        :currentNumberOfMoves="actualMoveNumber"
        :totalNumberOfMoves="allMoves.length"
        :nbErrors="nbErrors"
      />
    </div>
    <div v-else>
      <ConfigForm @pgnLoaded="onFileLoaded" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ValidateBoard from "../components/ValidateBoard";
import ConfigForm from "@/components/ConfigForm";
import MemorizeMoves from "@/components/MemorizeMoves";
import EndResume from "@/components/EndResume";

export default {
  name: 'Home',
  components: {
    ValidateBoard,
    ConfigForm,
    MemorizeMoves,
    EndResume,
  },
  data: function () {
    return {
      game: undefined,
      allMoves: undefined,
      lastFen: undefined,
      nextToFindFEN: undefined,
      nbErrors: 0,
      actualMoveNumber: 0,
      currentMovesToMemorize: undefined,
      forceEnd: false,
    }
  },

  computed: {
    isMemorizationPhase() {
      return this.currentMovesToMemorize !== undefined
    },
    isValidationPhase() {
      return this.nextToFindFEN !== undefined && this.currentMovesToMemorize === undefined
    },
    isEndPhase() {
      return (this.nextToFindFEN === undefined && this.allMoves !== undefined && this.actualMoveNumber === this.allMoves.length)
        || this.forceEnd
    },
  },
  methods: {
    onFileLoaded: function (parsedPGN) {
      this.allMoves = parsedPGN['moves'];
      this.game = require('chess.js')();
      this.loadNextIteration()
    },
    endGame(nbErrors) {
      this.nbErrors += nbErrors;
      this.nextToFindFEN = undefined;
      this.forceEnd = true;
    },
    onValidates: function (nbErrors) {
      console.log(nbErrors)
      this.nbErrors += nbErrors;
      if (this.actualMoveNumber !== this.allMoves.length)
        this.loadNextIteration();
      else
        this.nextToFindFEN = undefined;
    },
    onEndMemorizing: function () {
      this.currentMovesToMemorize = undefined;
    },
    loadNextIteration: function () {
      const lastMoveNumber = this.$store.state.numberMovesCheck + this.actualMoveNumber;
      this.currentMovesToMemorize = [];
      this.lastFen = this.game.fen();

      let i = this.actualMoveNumber;
      for (; i < lastMoveNumber && i < this.allMoves.length; i++) {
        const nextMove = this.allMoves[i]['move'];
        this.game.move(nextMove);
        this.currentMovesToMemorize.push(nextMove);
      }
      this.actualMoveNumber = i;
      this.nextToFindFEN = this.game.fen()
    }
  }
}
</script>
