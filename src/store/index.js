import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pubKey: '',
    keyName: 'Loading public key...',
    keyFingerprint: '',
    encryptedMessage: ''
  },
  mutations: {
    setPubKey (state, pubKey) {
      state.pubKey = pubKey
    },
    setKeyName (state, keyName) {
      state.keyName = keyName
    },
    setKeyFingerprint (state, keyFingerprint) {
      state.keyFingerprint = keyFingerprint
    },
    setEncryptedMessage (state, enc) {
      state.encryptedMessage = enc
    }
  },
  actions: {
    async fetchPubKey ({ commit, state }, url) {
      const resp = await fetch(url)
      if (resp.status > 399) {
        return
      }

      commit('setPubKey', await resp.text())
      const key = window.dec.bind(state.pubKey)()
      commit('setKeyName', key.name)
      commit('setKeyFingerprint', key.fingerprint)
    },
    async encryptMessage ({ commit, state }, msg) {
      const enc = window.enc.bind(state.pubKey)

      commit('setEncryptedMessage', enc(msg))
    }
  },
  modules: {
  }
})
