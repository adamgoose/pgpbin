<template>
  <div>
    <v-card-text>
      <v-textarea
        style="font-family: monospace"
        v-model="rawMessage"
        outlined
        auto-grow
        label="Raw Message"
        placeholder="Enter a secret message..."
      ></v-textarea>
      <v-textarea
        style="font-family: monospace"
        @click="copy"
        :value="encryptedMessage"
        readonly
        outlined
        label="Encrypted Message"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="purple" @click="encrypt">Encrypt</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({
    rawMessage: null
  }),
  computed: {
    ...mapState(['encryptedMessage'])
  },
  methods: {
    ...mapActions(['encryptMessage']),
    async encrypt () {
      const buf = new TextEncoder().encode(this.rawMessage)
      this.encryptMessage(buf)
      this.$emit('encrypted')
      this.copy()
    },
    copy () {
      if (!this.encryptedMessage) return
      this.$copyText(this.encryptedMessage)
    }
  }
}
</script>
