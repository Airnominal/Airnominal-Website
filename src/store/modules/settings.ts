import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'

import store from '@/store'

export enum ThemeType {
  System,
  Light,
  Dark
}

@Module({ name: 'settings', dynamic: true, preserveState: true, preserveStateType: 'mergeReplaceArrays', store })
class Settings extends VuexModule {
  theme: ThemeType = ThemeType.System

  @Mutation
  setTheme (theme: ThemeType): void {
    this.theme = theme
  }
}

export const SettingsModule = getModule(Settings)
