<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="purple" dark flat>
                <v-toolbar-title>pgpBin</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-card
                      v-on="on"
                      color="green darken-3"
                      class="font-weight-light caption py-1 px-2 d-none d-md-flex"
                      style="cursor: pointer;"
                      hover
                      @click="copyPubkey"
                    >
                      <!-- <v-icon>lock</v-icon> -->
                      Adam Engebretson &lt;adam.engebretson@instructure.com&gt;
                      <br />DE75 C21D E9C6 6976 61D8 900E DF15 A302 EA3C 9DCD
                    </v-card>
                  </template>
                  <span>Copy Public Key</span>
                </v-tooltip>
              </v-toolbar>
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
                  v-model="encryptedMessage"
                  readonly
                  outlined
                  label="Encrypted Message"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="purple" @click="encrypt">Encrypt</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar v-model="encrypted">
          Encrypted message copied to clipboard!
          <v-btn text @click="encrypted = false" color="pink">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({
    rawMessage: '',
    encrypted: false
  }),
  computed: {
    ...mapState(['pubKey', 'encryptedMessage'])
  },
  methods: {
    ...mapActions(['fetchPubKey', 'encryptMessage']),
    encrypt () {
      this.encryptMessage(this.rawMessage)
    },
    copy () {
      if (!this.encryptedMessage) return
      this.$copyText(this.encryptedMessage)
      this.encrypted = false
      this.$nextTick(() => {
        this.encrypted = true
      })
    },
    copyPubkey () {
      this.$copyText(this.pubKey)
    }
  },
  mounted () {
    this.fetchPubKey('/pgp_keys.asc')
  },
  watch: {
    encryptedMessage: function () {
      this.copy()
    }
  },
  props: {
    source: String
  }
}
</script>
