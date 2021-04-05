<template>
<div class="load-pgn-file">
  <div class="config-form">
    <div class="input-row">
      <label for="inputSecondsByMove">Time by move (in seconds)</label>
      <input type="number" v-model="secondsByMove" id="inputSecondsByMove">
    </div>
    <div class="input-row">
      <label for="inputNumberMovesCheck">Number of moves by iteration</label>
      <input type="number" v-model="numberMovesCheck" id="inputNumberMovesCheck">
    </div>
    <div class="input-row">
      <div class="error" v-if="errorMessage !== ''">
        <i class="fa fa-times-circle"></i>
        {{errorMessage}}
      </div>
      <input type="file" ref="pgnFile" @change="loadPGNFile">
    </div>
    <div class="input-row">
      <input type="submit" value="Start!" @click="submitConfiguration">
    </div>
  </div>
</div>
</template>

<script>

const pgnParser = require('pgn-parser')

export default {
  name: "LoadPGNFile",
  data: function () {
    return {
      errorMessage: "",
      secondsByMove: this.$store.state.secondsByMove,
      numberMovesCheck: this.$store.state.numberMovesCheck,
      parsedPGN: undefined
    }
  },
  methods: {
    loadPGNFile() {
      let file = this.$refs.pgnFile.files[0];

      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      reader.onload = evt => {
        try {
          const [result] = pgnParser.parse(evt.target.result);
          this.parsedPGN = result;
          this.errorMessage = '';
        } catch (e) {
          this.errorMessage = 'incorrect file';
        }
      }

      reader.onerror = evt => {
        console.log(evt.error)
      }
    },
    submitConfiguration() {
      this.$store.commit('setSecondsByMove', parseInt(this.secondsByMove));
      this.$store.commit('setNumberMovesCheck', parseInt(this.numberMovesCheck));

      this.$emit('pgnLoaded', this.parsedPGN)
    }
  }
}
</script>

<style scoped>
@import url('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

.error {
  color: #D8000C;
}

.config-form {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 180px;
}
.input-row {
  display: flex;
  flex-direction: column;
}
.input-row input[type="number"] {
  width: 50px;
}
.input-row input[type="submit"] {
  width: 120px;
  height: 50px;
  font-size: 20px;
}
</style>
