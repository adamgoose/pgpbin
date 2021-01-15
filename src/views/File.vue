<template>
  <div>
    <v-card-text>
      <v-file-input
        v-model="rawFile"
        outlined
        auto-grow
        label="Raw File"
        placeholder="Pick a secret file..."
        :loading="!!loading"
      ></v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="purple" @click="encryptFile" :loading="!!loading" :disabled="!rawFile">Encrypt File</v-btn>
      <a ref="download" style="display: none;" :href="downloadUrl" :download="downloadName"></a>
    </v-card-actions>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({
    rawFile: null,
    downloadUrl: '',
    loading: 0
  }),
  computed: {
    ...mapState(['encryptedMessage']),
    downloadName () {
      if (!this.rawFile) { return '' }
      return `encrypted_${this.rawFile.name}`
    }
  },
  methods: {
    ...mapActions(['encryptMessage']),
    async encryptFile () {
      this.loading++
      const buf = new Uint8Array(await this.rawFile.arrayBuffer())
      await this.encryptMessage(buf)
      this.download()
    },
    download: function () {
      if (!this.encryptedMessage) { return }

      const url = window.URL.createObjectURL(
        new Blob([this.encryptedMessage], { type: 'text/plain' })
      )
      this.$set(this, 'downloadUrl', url)
      this.$nextTick(() => {
        this.$refs.download.click()
      })

      setTimeout(() => {
        this.cleanup(url)
      }, 1000)
    },
    cleanup (url) {
      this.loading = 0
      this.rawFile = null
      this.downloadUrl = null
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>
