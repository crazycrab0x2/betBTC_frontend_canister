import { defineStore } from 'pinia'
import type { Market, Category } from '@/types/marketDataTypes'

export const useMarketStore = defineStore('market', {
  state: () => ({
    markets: [] as Market[],
    categories: [] as Category[],
    replyComment: {} as any,
    btcPrice: 0
  }),
  actions: {
    setMarkets(value: Market[]) {
      this.markets = value
    },
    setCategories(value: Category[]) {
      this.categories = value
    },
    addMarket(value: Market) {
      this.markets.push(value)
    },
    setReplyComment(value: any) {
      this.replyComment = value
    },
    setBtcPrice(value: number) {
      this.btcPrice = value
    }
  },
  persist: true
})
