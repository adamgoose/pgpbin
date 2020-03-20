import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pubKey: '',
    encryptedMessage: ''
  },
  mutations: {
    setPubKey (state, pubKey) {
      state.pubKey = pubKey
    },
    setEncryptedMessage (state, enc) {
      state.encryptedMessage = enc
    }
  },
  actions: {
    async fetchPubKey ({ commit, state }, url) {
      const resp = await fetch(url)
      commit('setPubKey', await resp.text())
    },
    async encryptMessage ({ commit, state }, msg) {
      const enc = window.enc.bind(state.pubKey)

      commit('setEncryptedMessage', enc(msg))
    }
  },
  modules: {
  }
})
