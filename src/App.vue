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
                      {{ keyName }}<br />{{ keyFingerprint | fingerprint }}
                    </v-card>
                  </template>
                  <span>Copy Public Key</span>
                </v-tooltip>
                <template v-slot:extension>
                  <v-tabs v-model="tab" color="white" fixed-tabs>
                    <v-tabs-slider></v-tabs-slider>

                    <v-tab key="text">
                      Text
                    </v-tab>
                    <v-tab key="file">
                      File
                    </v-tab>
                  </v-tabs>
                </template>
              </v-toolbar>
              <v-tabs-items v-model="tab">
                <v-tab-item key="text">
                  <EncryptText @encrypted="encrypted = true" />
                </v-tab-item>
                <v-tab-item key="file">
                  <EncryptFile />
                </v-tab-item>
              </v-tabs-items>
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
import EncryptText from '@/views/Text'
import EncryptFile from '@/views/File'
export default {
  components: { EncryptText, EncryptFile },
  data: () => ({
    tab: 'text',
    encrypted: false
  }),
  computed: {
    ...mapState(['pubKey', 'keyName', 'keyFingerprint'])
  },
  methods: {
    ...mapActions(['fetchPubKey']),
    copyPubkey () {
      this.$copyText(this.pubKey)
    }
  },
  mounted () {
    this.fetchPubKey(`https://keybase.io/${this.$route.params.username}/pgp_keys.asc`)
  },
  filters: {
    fingerprint (raw) {
      return (raw.toUpperCase().match(/.{4}/g) || []).join(' ')
    }
  }
}
</script>
