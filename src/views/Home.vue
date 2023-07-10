<template>
  <div>
    <v-row class="ma-3 pt-8" justify="center">
      <v-card width="35rem">
        <v-card-title class="pb-0">
          Our Services
        </v-card-title>

        <v-card-actions>
          <v-btn href="http://zrak.gimvic.org:3000" text large color="primary" target="_blank">
            Grafana
          </v-btn>
          <v-btn href="http://zrak.gimvic.org:8086" text large color="primary" target="_blank">
            InfluxDB
          </v-btn>
          <v-btn href="http://zrak.gimvic.org:27017" text large color="primary" target="_blank">
            MongoDB
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-row class="ma-3 pt-8" justify="center">
      <v-card width="35rem">
        <v-card-title class="pb-0">
          Manage Stations
        </v-card-title>

        <v-card-actions>
          <v-btn v-if="!isLoggedIn" :href="`${appBackend}/auth/login`" text large color="primary">
            Login with GitHub
          </v-btn>

          <v-btn v-if="isLoggedIn" :to="{ name: 'registerStation' }" text large color="primary">
            Register Station
          </v-btn>

          <!-- <v-btn v-if="isLoggedIn" :to="{ name: 'stationsList' }" text large color="primary">
            Manage Stations
          </v-btn> -->
        </v-card-actions>

        <v-card-text v-if="isLoggedIn" class="pt-0">
          Currently logged in as {{ username }}, <a :href="`${appBackend}/auth/logout`">log out here</a>.
        </v-card-text>
      </v-card>
    </v-row>

    <v-row class="ma-3 pt-8" justify="center">
      <v-card width="35rem">
        <v-card-title>
          About Airnominal
        </v-card-title>

        <v-card-text>
          <p>The problem of air pollution is one of the most acutely dangerous ecological problems we face today. According to studies made by World Health Organization, almost all of the global population breathe air that exceeds WHO guideline limits containing high levels of pollutants. Even though sensors and other measurement equipment is already available, data that researchers use usually comes from two to three stations in an area, and large datasets of high spatial resolution are not available. To test if any solution addressing air quality is effective, researchers need to be able to obtain many higher quality data in a standardized format.</p>
          <p>This platform has been built to address this problem, enabling people to connect and exchange air quality measurements and design an open measuring station that anyone can build and connect to the platform, thus providing valuable information for the research and limiting of the main causes of high PM particles concentration.</p>
          <p>The platform supports any kind of measurements, not limited just to air quality data, and provides a simple to use Arduino library for submitting data.</p>
          <p>More details about Airnominal can be found <a href="https://github.com/Airnominal" target="_blank">on GitHub</a>.</p>
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  isLoggedIn = false
  username: string | null = null

  appBackend = process.env.VUE_APP_BACKEND

  created (): void {
    document.title = process.env.VUE_APP_TITLE
    this.$emit('setPageTitle', process.env.VUE_APP_TITLE)

    this.checkLoggedIn()
  }

  async checkLoggedIn (): Promise<void> {
    const response = await fetch(process.env.VUE_APP_BACKEND + '/auth/status', { credentials: 'include' })
    const content = await response.json()
    this.isLoggedIn = response.ok && content.ok

    if (this.isLoggedIn) this.username = content.user.display_name
    else this.username = null
  }
}
</script>
