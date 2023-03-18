<template>
  <div class="registration px-4 pt-4">
    <h2 class="pb-2">Register Station</h2>

    <div v-if="!this.stationRegistered">
      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-text-field :rules="[v => !!v || 'Name is required!']"
          v-model="stationName"
          label="Name"
          maxlength="200"
          required></v-text-field>

        <v-text-field v-model="stationDescription" label="Description" maxlength="200" required></v-text-field>

        <v-input :messages="['Add all sensors the station provides']">
          Sensors
        </v-input>

        <v-list flat dense class="sensors-list">
          <v-list-item v-for="(sensor, index) in stationSensors" :key="index">
            <v-row>
              <v-col cols="7">
                <v-text-field :rules="[v => !!v || 'Name is required!']"
                  v-model="sensor.name"
                  label="Name"
                  required
                  dense></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-select :rules="[v => !!v || 'Quantity is required!']"
                  v-model="sensor.quantity"
                  :items="availableQuantities"
                  :item-text="item => `${item.name} (${item.unit})`"
                  :item-value="item => item"
                  label="Quantity"
                  persistent-hint
                  required
                  dense></v-select>
              </v-col>
            </v-row>
            <v-list-item-action>
              <v-btn @click="removeSensor(index)" icon>
                <v-icon>{{ mdiClose }}</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-list-item>
            <v-list-item-content></v-list-item-content>
            <v-list-item-action>
              <v-btn @click="addSensor()" icon>
                <v-icon>{{ mdiPlus }}</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <div class="pt-6 text-justify">
          <strong>Important: </strong>
          Once you create a station, you cannot modify or remove it. This includes not being able to
          rename the station or add new sensors. Please be sure the provided information is correct
          before submitting a form. This will be implemented in a future version.
        </div>

        <div class="py-2 text-justify">
          As the platform is currently in the early stages of development, we cannot guarantee 100%
          availability and reliability of the service. As such, your registered stations and measurements
          may not be stored permanently. We are working hard to improve the stability of the service
          and implement missing station management features.
        </div>

        <v-checkbox :rules="[v => !!v || 'You must agree to continue!']" label="Do you agree?" required></v-checkbox>

        <v-btn :disabled="formSubmitted" color="primary" class="mt-3" @click="submitForm">
          Submit
        </v-btn>
      </v-form>
    </div>

    <div v-else>
      <div class="text-justify pb-3">
        Your station has been successfully registered to the server. Please use the following
        config to set up it up. Make sure you save the config as you will not be able to view
        it again after closing this page.
      </div>

      <div class="text-justify pb-3">
        Please check the <a href="https://github.com/Airnominal"
        target="_blank">documentation</a> for more details about setting up the station.
      </div>

      <div class="pb-3">
        <ul>
          <li>Station Name: {{ this.stationConfig.station_name }}</li>
          <li>Station ID: <kbd>{{ this.stationConfig.station_id }}</kbd></li>
          <li>Station Token: <kbd>{{ this.stationConfig.token }}</kbd></li>
        </ul>
      </div>

      <div v-for="(sensor, index) in this.stationConfig.sensors" :key="index" class="pb-3">
        <ul>
          <li>Sensor Name: {{ sensor.sensor_name }}</li>
          <li>Sensor Quantity: {{ sensor.quantity }}</li>
          <li>Sensor Unit: {{ sensor.unit }}</li>
          <li>Sensor ID: <kbd>{{ sensor.short_id }}</kbd></li>
        </ul>
      </div>

      <div class="pb-3">
        <details>
          <summary>View raw config</summary>
          <pre><code class="d-block">{{ JSON.stringify(this.stationConfig, null, 2) }}</code></pre>
        </details>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Add back top padding that is removed by a dialog
.v-dialog > .v-card > .v-card__text {
  padding: 16px 24px 20px !important;
}

// Remove background in dark mode
.sensors-list {
  background-color: transparent !important;
}

// Center registration page
.registration {
  margin: 0 auto;
  max-width: 40rem;
}
</style>

<script lang="ts">
import { mdiClose, mdiPlus } from '@mdi/js'
import { Component, Vue } from 'vue-property-decorator'

import { quantities, Quantity } from '@/utils/quantities'
import { displaySnackbar } from '@/utils/snackbar'

@Component
export default class RegisterStation extends Vue {
  formValid = true
  formSubmitted = false
  stationRegistered = false
  stationConfig: unknown = []

  stationName: string | null = null
  stationDescription: string | null = null
  stationSensors: { name?: string, quantity?: Quantity }[] = [{}]

  availableQuantities = quantities
  mdiClose = mdiClose
  mdiPlus = mdiPlus

  async created (): Promise<void> {
    document.title = process.env.VUE_APP_TITLE + ' – Register Station'
    this.$emit('setPageTitle', 'Register Station')
  }

  async submitForm (): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!this.$refs.form.validate()) return
    this.formSubmitted = true

    const response = await fetch(process.env.VUE_APP_BACKEND + '/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        station_name: this.stationName,
        station_description: this.stationDescription,
        sensors: this.stationSensors.map(sensor => ({
          sensor_name: sensor.name,
          quantity: sensor.quantity?.name,
          unit: sensor.quantity?.unit
        }))
      })
    })

    const content = await response.json()

    if (!response.ok) {
      if (response.status === 403) {
        displaySnackbar('Not authenticated, log in and try again')
      } else {
        displaySnackbar('Error while registering the station, check the console for details')
      }

      console.log({ status: response.status, ...content })
      this.formSubmitted = false
      return
    }

    this.stationConfig = content
    this.stationRegistered = true
  }

  addSensor () {
    this.stationSensors.push({})
  }

  removeSensor (index: number) {
    this.stationSensors.splice(index, 1)
  }
}
</script>
