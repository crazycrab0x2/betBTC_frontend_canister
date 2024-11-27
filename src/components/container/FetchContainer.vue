<template>
  <div class="hidden"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useMarketStore } from '@/stores/market'
import { useHelpers } from '@/composables/useHelpers'

const { setBtcPrice } = useMarketStore()
const { fetchBTCdata } = useHelpers()

let btcPriceTimer: any

onMounted(() => {
  btcPriceTimer = setInterval(async () => {
    try {
      const fetchedBtcprice = await fetchBTCdata()
      setBtcPrice(fetchedBtcprice)
    } catch (error) {
      console.error('fetched btc price error ======>', error)
    }
  }, 10000)
})

onUnmounted(() => clearInterval(btcPriceTimer))
</script>
