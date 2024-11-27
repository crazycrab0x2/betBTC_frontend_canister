import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notification: {
      title: '',
      content: '',
      visible: false
    }
  }),
  actions: {
    setNotification(value) {
      this.notification = value
    }
  }
})
