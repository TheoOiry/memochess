import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    secondsByMove: 4,
    numberMovesCheck: 10,
  },
  mutations: {
    setSecondsByMove (state, seconds) {
      state.secondsByMove = seconds
    },
    setNumberMovesCheck (state, numberOfMoves) {
      state.numberMovesCheck = numberOfMoves
    }
  },
  actions: {
  },
  modules: {
  }
})
