import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isSignupModal: false,
    isDepositModal: false,
    isHeaderExpand: false,
    isNewMarket: false,
    isTelegramMiniApp: false,
    keyboardHeight: 0,
    viewportHeight: 0,
    searchText: '',
    isBtc: false
  }),
  actions: {
    setSignupModal(value) {
      this.isSignupModal = value
    },
    setDepositModal(value) {
      this.isDepositModal = value
    },
    setNewMarketModal(value) {
      this.isNewMarket = value
    },
    setHeaderExpand(value) {
      this.isHeaderExpand = value
    },
    setIsTelegramMiniApp(value) {
      this.isTelegramMiniApp = value
    },
    setKeyboardHeight(value) {
      this.keyboardHeight = value
    },
    setViewportHeight(value) {
      this.viewportHeight = value
    },
    setSearchText(value) {
      this.searchText = value
    },
    toggleIsBtc() {
      this.isBtc = !this.isBtc
    }
  },
  persist: true
})
