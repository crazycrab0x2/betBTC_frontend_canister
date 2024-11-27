<template>
  <div class="w-full xl:w-6/12 landing-view p-2">
    <div class="w-full h-full rounded-[24px] border border-[#3F3F45] flex flex-col p-3 gap-3">
      <h2 class="text-[14px] font-[500] leading-[20px] inter text-[#A1A1A9]">
        {{
          profile
            ? `Hi ${profile.displayName || profile.handle}, welcome to betBTC`
            : 'Welcome to betBTC'
        }}
      </h2>
      <div class="flex flex-col gap-2" style="height: -webkit-fill-available">
        <div class="flex md:flex-row md:items-center flex-col gap-2 justify-between w-full">
          <h6 class="inter font-[500] leading-[26px] text-[20px] text-[#E4E4E7]">Top Markets</h6>
          <div class="flex gap-4">
            <div class="flex gap-1">
              <Icon
                icon="hugeicons:coins-01"
                color="#A1A1A9"
                width="18"
                height="18"
                class="flex-shrink-0"
              />
              <p
                class="text-neutral-400 text-[14px] inline-flex items-center leading-5 font-normal"
              >
                <Icon
                  v-if="isBtc"
                  icon="ic:twotone-currency-bitcoin"
                  color="#E4E4E7CC"
                  width="16"
                />
                <Icon v-else icon="bx:dollar" color="#E4E4E7CC" width="16" />
                <span>{{
                  isBtc
                    ? nFormatter(
                        convertSats2Btc(
                          topMarketData?.todayVolume ? topMarketData?.todayVolume : 0
                        ),
                        1
                      )
                    : (
                        convertSats2Btc(
                          topMarketData?.todayVolume ? topMarketData?.todayVolume : 0
                        ) * btcPrice
                      ).toFixed(2)
                }}</span>
                <span>/ day</span>
              </p>
            </div>
            <div class="flex gap-1">
              <Icon
                icon="fluent:arrow-swap-16-regular"
                color="#A1A1A9"
                width="18"
                height="18"
                class="flex-shrink-0"
              />
              <p class="text-neutral-400 text-[14px] leading-5 font-normal">
                {{ topMarketData?.todayTxn ? topMarketData?.todayTxn : 0 }} txns / day
              </p>
            </div>
          </div>
          <dropdown close-inside align-to-end>
            <template #trigger>
              <button
                class="flex gap-1 px-[14px] py-1.5 border border-neutral-700 rounded-lg items-center justify-between"
              >
                <p class="inter font-medium text-[14px] leading-5 text-neutral-400">
                  {{ selectedSort ? sorts.find((e) => e.slug === selectedSort)?.title : 'Sort' }}
                </p>
                <Icon icon="fluent:chevron-up-down-24-filled" color="#A1A1A9" />
              </button>
            </template>
            <div
              class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700"
            >
              <button
                v-for="(sort, index) in sorts"
                class="inter text-neutral-200 p-2 text-[12px] font-medium leading-4 rounded-lg capitalize flex items-center gap-1.5"
                :class="selectedSort === sort.slug ? 'bg-neutral-800' : 'hover:bg-neutral-800'"
                @click="() => onSelectSort(sort.slug)"
                :key="index"
              >
                <Icon
                  v-if="sort.icon"
                  :icon="sort.icon"
                  color="#E4E4E7"
                  width="16"
                  height="16"
                  class="flex-shrink-0"
                />
                <span>
                  {{ sort.slug }}
                </span>
              </button>
            </div>
          </dropdown>
        </div>
        <div
          class="grid sm:grid-cols-3 grid-cols-1 w-full gap-3"
          style="height: -webkit-fill-available"
        >
          <top-market-card
            v-for="(topMarket, index) in topMarketData?.topMarkets"
            :key="index"
            v-bind="{ ...topMarket, sort: selectedSort }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { useHelpers } from '@/composables/useHelpers'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import type { TopMarketSortType } from '@/backend/betbtc-backend.did'
import type { TopMarketData } from '@/types/marketDataTypes'
import TopMarketCard from './TopMarketCard.vue'
import { useMarketStore } from '@/stores/market'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
const marketStore = useMarketStore()
const { btcPrice } = storeToRefs(marketStore)
const { isBtc } = storeToRefs(layoutStore)

const route = useRoute()
const authStore = useAuthStore()
const { backendActor, profile } = storeToRefs(authStore)
const actor = backendActor.value

const { nFormatter, convertSats2Btc } = useHelpers()

const selectedSort = ref<string>('Vol')
const topMarketData = ref<TopMarketData | null>(null)

const onSelectSort = (sort: string) => {
  selectedSort.value = sort
  console.log(sort)
}

const sorts = ref<
  {
    slug: string
    title: string
    icon: string
  }[]
>([
  {
    slug: 'Vol',
    title: 'Volume',
    icon: 'hugeicons:coins-01'
  },
  {
    slug: 'Txn',
    title: 'Transactions',
    icon: 'fluent:arrow-swap-16-regular'
  }
])

onBeforeMount(async () => {
  const marketCategory = route.query.category as string
  topMarketData.value = (await actor.get_top_markets(
    { Vol: null },
    marketCategory ? [marketCategory] : []
  )) as TopMarketData
})

watch(
  () => selectedSort.value,
  async () => {
    const marketCategory = route.query.category as string
    topMarketData.value = (await actor.get_top_markets(
      { [selectedSort.value]: null } as TopMarketSortType,
      marketCategory ? [marketCategory] : []
    )) as TopMarketData
  }
)

watch(
  () => route.query.category,
  async () => {
    const marketCategory = route.query.category as string
    topMarketData.value = (await actor.get_top_markets(
      { [selectedSort.value]: null } as TopMarketSortType,
      marketCategory ? [marketCategory] : []
    )) as TopMarketData
  }
)
</script>
