<template>
  <v-app>
    <v-app-bar app clipped-left color="primary" dark>
      <div class="d-flex align-center overflow-x-hidden pr-1">
        <router-link title="Homepage" :to="{ name: 'home' }">
          <v-img alt="Airnominal Logo" src="./assets/logo.svg" width="40" />
        </router-link>
        <v-toolbar-title class="ml-2">{{ pageTitle }}</v-toolbar-title>
      </div>

      <v-spacer />

      <v-btn :to="{ name: 'registerStation' }"
        alt="Register Station"
        aria-label="Register Station"
        class="mr-1"
        icon
        large>
        <v-icon>{{ mdiServerPlus }}</v-icon>
      </v-btn>

      <v-btn :to="{ name: 'settings' }"
        alt="Settings"
        aria-label="Settings"
        class="mr-n2"
        icon
        large>
        <v-icon>{{ mdiCog }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main id="main">
      <v-container fluid>
        <router-view class="router-view" @setPageTitle="setPageTitle" />
      </v-container>
    </v-main>

    <v-snackbar v-model="isSnackbarDisplayed">
      {{ snackbarMessage }}

      <template v-if="snackbarButton" v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snackbarAction()">
          {{ snackbarButton }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style lang="scss">
// Hide scrollbar that Vuetify adds by default
html {
  overflow-y: auto !important;
}

// Reverse switch and label
.v-input--reverse .v-input__slot {
  flex-direction: row-reverse;
  justify-content: flex-end;

  .v-application--is-ltr & {
    .v-input--selection-controls__input {
      margin-left: 8px;
      margin-right: 0;
    }
  }

  .v-application--is-rtl & {
    .v-input--selection-controls__input {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}

// Move switch and label more to the top
.v-input--switch {
  margin-bottom: -25px;
  margin-top: 0;
}
</style>

<script lang="ts">
import { mdiCog, mdiServerPlus } from '@mdi/js'
import { Component, Vue } from 'vue-property-decorator'

import { SettingsModule, ThemeType } from '@/store/modules/settings'
import { displaySnackbar, hideSnackbar } from '@/utils/snackbar'

@Component
export default class App extends Vue {
  mdiServerPlus = mdiServerPlus
  mdiCog = mdiCog

  pageTitle = process.env.VUE_APP_TITLE

  isSnackbarDisplayed = false
  snackbarMessage = ''
  snackbarButton = ''
  snackbarAction?: () => void

  snackbarHandler (event: Event): void {
    if (!(event as CustomEvent).detail) {
      this.isSnackbarDisplayed = false
      return
    }

    this.snackbarMessage = (event as CustomEvent).detail.message
    this.snackbarButton = (event as CustomEvent).detail?.button
    this.snackbarAction = (event as CustomEvent).detail?.action

    this.isSnackbarDisplayed = true
  }

  themeHandler (event: MediaQueryListEvent): void {
    // Change Vuetify theme to match system theme
    if (SettingsModule.theme === ThemeType.System) {
      this.$vuetify.theme.dark = event.matches
    }

    setTimeout(() => {
      // Set body color to make it possible for browser to style scrollbars
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.getElementsByTagName('body')[0].style.background = getComputedStyle(document.getElementById('app'))['background-color']
    }, 0)
  }

  swUpdatedHandler (event: Event): void {
    const registration: ServiceWorkerRegistration = (event as CustomEvent).detail

    displaySnackbar('An update is available', 'Update', () => {
      hideSnackbar()
      if (!registration || !registration.waiting) return
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    })
  }

  controllerChangedHandler (): void {
    // Add GET parameter to invalidate cache of index HTML file
    window.location.href = location.protocol + '//' + location.host + '?updated=' + (new Date()).getTime()
  }

  created (): void {
    // Event listeners for displaying and hiding snackbars
    document.addEventListener('displaySnackbar', this.snackbarHandler)
    document.addEventListener('hideSnackbar', this.snackbarHandler)

    // Event listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', this.themeHandler)

    // Event listener for detecting service worker updates
    document.addEventListener('serviceWorkerUpdated', this.swUpdatedHandler, { once: true })

    // Event listener for detecting controller changes
    navigator.serviceWorker && navigator.serviceWorker.addEventListener('controllerchange', this.controllerChangedHandler, { once: true })
  }

  mounted (): void {
    // Set body color to make it possible for browser to style scrollbars
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.getElementsByTagName('body')[0].style.background = getComputedStyle(document.getElementById('app'))['background-color']
  }

  destroyed (): void {
    // Remove event listeners for displaying and hiding snackbars
    document.removeEventListener('displaySnackbar', this.snackbarHandler)
    document.removeEventListener('hideSnackbar', this.snackbarHandler)

    // Remove event listener for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.themeHandler)

    // Remove event listener for detecting service worker updates
    document.removeEventListener('serviceWorkerUpdated', this.swUpdatedHandler)

    // Remove event listener for detecting controller changes
    navigator.serviceWorker && navigator.serviceWorker.removeEventListener('controllerchange', this.controllerChangedHandler)
  }

  setPageTitle (pageTitle: string): void {
    this.pageTitle = pageTitle
  }
}
</script>
