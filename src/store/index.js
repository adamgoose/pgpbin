import Vue from 'vue'
import Vuex from 'vuex'
const openpgp = require('openpgp')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pubKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: MagicPad v1.0.3 h2
Comment: https://magicpad.io

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
xTXeN8SeoFCGf1Ak7/hnP7kj
=YxNd
-----END PGP PUBLIC KEY BLOCK-----`,
    encryptedMessage: ''
  },
  mutations: {
  },
  actions: {
    async encryptMessage ({ commit, state }, msg) {
      const { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(msg),
        publicKeys: (await openpgp.key.readArmored(state.pubKey)).keys
      })
      state.encryptedMessage = encrypted
    }
  },
  modules: {
  }
})
