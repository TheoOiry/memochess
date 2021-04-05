<template>
<div class="memorize-moves">
  <div class="move">
    <div>
      {{ currentMove.name }}
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "MemorizeMoves",
  data: function () {
    return {
      currentMove: {
        index: -1,
        name: ""
      }
    }
  },
  props: {
    movesToMemorize: {
      default: []
    }
  },
  created() {
    this.doNextAction()
  },
  methods: {
    doNextAction() {
      if (this.currentMove.index === this.movesToMemorize.length - 1)
        this.$emit('endMemorizing');
      else
        this.loadNextMove();
    },
    loadNextMove() {
      this.currentMove = {
        name: this.movesToMemorize[this.currentMove.index + 1],
        index: this.currentMove.index + 1
      }
      this.playSound()
      setTimeout(this.doNextAction, this.$store.state.secondsByMove * 1000)
    },
    playSound() {
      let msg = new SpeechSynthesisUtterance();
      let voices = window.speechSynthesis.getVoices();
      msg.voice = voices[0];
      msg.text = this.currentMove.name;

      speechSynthesis.speak(msg);
    }
  }
}
</script>

<style scoped>
.move {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
}

.move div {
  font-size: 20vw;
}
</style>
