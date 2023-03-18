<template>
  <div class="settings px-4 pt-4">
    <settings-action v-model="themeSelectionDialog"
      :icon="mdiWeatherNight"
      :message="themeStatus"
      label="Color Theme" />

    <v-divider class="my-6" />

    <settings-action :icon="mdiUpdate"
      :message="`Current version: ${appVersion}`"
      label="Update Upp"
      @click.native="updateApp" />

    <v-dialog v-model="themeSelectionDialog" width="35rem">
      <theme-selection v-if="themeSelectionDialog" @closeDialog=closeThemeDialog />
    </v-dialog>
  </div>
</template>

<style lang="scss">
// Add back top padding that is removed by a dialog
.v-dialog > .v-card > .v-card__text {
  padding: 16px 24px 20px !important;
}

// Center settings page
.settings {
  margin: 0 auto;
  max-width: 40rem;
}
</style>

<script lang="ts">
import { mdiUpdate, mdiWeatherNight } from '@mdi/js'
import { Component, Vue } from 'vue-property-decorator'

import SettingsAction from '@/components/settings/SettingsAction.vue'
import SettingsSwitch from '@/components/settings/SettingsSwitch.vue'
import ThemeSelection from '@/components/settings/ThemeSelection.vue'
import { SettingsModule, ThemeType } from '@/store/modules/settings'

@Component({
  components: {
    ThemeSelection,
    SettingsAction,
    SettingsSwitch
  }
})
export default class Settings extends Vue {
  mdiWeatherNight = mdiWeatherNight
  mdiUpdate = mdiUpdate

  get themeStatus (): string {
    switch (SettingsModule.theme) {
      case ThemeType.System:
        return 'System'
      case ThemeType.Light:
        return 'Light'
      case ThemeType.Dark:
        return 'Dark'
    }
  }

  get appVersion (): string {
    return process.env.VUE_APP_VERSION || 'No data'
  }

  themeSelectionDialog = false

  created (): void {
    document.title = process.env.VUE_APP_TITLE + ' – Settings'
    this.$emit('setPageTitle', 'Settings')
  }

  async updateApp (): Promise<void> {
    if (process.env.NODE_ENV === 'production' && navigator.serviceWorker && navigator.serviceWorker.controller) {
      // Skip service worker waiting
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Add GET parameter to invalidate cache of index HTML file
    window.location.href = location.protocol + '//' + location.host + '?updated=' + (new Date()).getTime()
  }

  closeThemeDialog (): void {
    this.themeSelectionDialog = false
  }
}
</script>
