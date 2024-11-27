<template>
  <div
    class="flex flex-col items-start p-2 gap-3 border border-neutral-700 rounded-2xl justify-between"
  >
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <div class="flex flex-row items-center gap-1">
          <Icon icon="akar-icons:calendar" color="#A1A1A9" width="16" height="16" />
          <p class="inter text-neutral-400 text-[12px] leading-[20px] font-[400]">
            Ends {{ DateTime.fromMillis(Number(expireAt)).toFormat('dd LLL yy') }}
          </p>
        </div>
        <div class="flex items-center">
          <Icon
            v-if="sort === 'Vol'"
            icon="hugeicons:coins-01"
            color="#A1A1A9"
            width="14"
            height="14"
            class="flex-shrink-0"
          />
          <Icon
            v-else
            icon="fluent:arrow-swap-16-regular"
            color="#A1A1A9"
            width="14"
            height="14"
            class="flex-shrink-0"
          />
          <span
            class="text-neutral-400 text-[12px] leading-4 font-normal ml-[3px] mr-[1px]"
            v-if="sort === 'Vol' && isBtc"
          >
            ₿
          </span>
          <span
            class="text-neutral-400 text-[12px] leading-4 font-normal ml-[3px] mr-[1px]"
            v-if="sort === 'Vol' && !isBtc"
          >
            $
          </span>
          <p class="text-neutral-400 text-[12px] leading-4 font-normal">
            {{
              sort === 'Vol'
                ? isBtc
                  ? nFormatter(convertSats2Btc(totalVolume), 1)
                  : convertSats2Btc(totalVolume * btcPrice).toFixed(2)
                : `${nFormatter(totalTxn, 1)} txns`
            }}
          </p>
        </div>
      </div>
      <p class="inter font-medium leading-[20px] text-[14px] text-[#FAFAFA] min-h-[60px] overflow-hidden text-ellipsis webkit-box-limit">
        {{ title }}
      </p>
    </div>
    <a
      class="flex items-center justify-between border border-[#8C4F27] rounded-xl py-1.5 px-3 gap-1"
      :href="`/market/${id}`"
    >
      <span class="inter text-[#E88340] text-[14px] leading-5 font-medium"> Bet Now </span>
      <Icon icon="iconamoon:arrow-top-right-1-light" color="#E88340" width="16" height="16" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { useHelpers } from '@/composables/useHelpers'
import { Icon } from '@iconify/vue'
import type { TopMarket } from '@/types/marketDataTypes'
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/stores/market'
import { useLayoutStore } from '@/stores/layout'
import { DateTime } from 'luxon'

const layoutStore = useLayoutStore()
const marketStore = useMarketStore()
const { btcPrice } = storeToRefs(marketStore)
const { isBtc } = storeToRefs(layoutStore)

interface TopMarketProps extends TopMarket {
  sort: string
}

withDefaults(defineProps<TopMarketProps>(), {})

const { nFormatter, convertSats2Btc } = useHelpers()
</script>
<style scoped>
.webkit-box-limit {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>