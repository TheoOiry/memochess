<template>
<div class="end-resume">
  <div class="message">{{ currentNumberOfMoves }}/{{ totalNumberOfMoves }} moves guessed with {{ nbErrors }} errors</div>
  <form>
    <input type="submit" value="Restart">
  </form>
</div>
</template>

<script>
export default {
  name: "EndResume",
  props: ['nbErrors', 'currentNumberOfMoves', 'totalNumberOfMoves']
}
</script>

<style scoped>
.message {
  font-size: 30px;
  text-align: center;
  width: 100%;
}

form {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
form input {
  font-size: 25px;
  padding: 10px;
}
</style>
