<template>
  <div class="w-full rounded-[12px] border-[1px] border-[#27272A] overflow-hidden">
    <div
      class="grid px-2 bg-[#18181B]"
      :class="
        tab === 'Funds'
          ? 'md:grid-cols-12 grid-cols-4'
          : tab === 'Bettings'
            ? 'md:grid-cols-12 grid-cols-5'
            : 'md:grid-cols-12 grid-cols-3'
      "
    >
      <div
        class="overflow-hidden md:col-span-2 h-[40px] flex items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Date
      </div>
      <div
        v-if="tab === 'Bettings'"
        class="overflow-hidden md:col-span-5 h-[40px] flex items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Market
      </div>
      <div
        v-if="tab === 'Bettings'"
        class="overflow-hidden md:col-span-2 h-[40px] flex items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Option
      </div>
      <div
        v-if="tab !== 'Points'"
        class="overflow-hidden md:col-span-1 h-[40px] flex items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Types
      </div>
      <div
        v-if="tab !== 'Points'"
        :class="
          tab == 'Funds' ? 'md:col-span-2 border-r-[1px] border-r-[#27272A]' : 'md:col-span-2'
        "
        class="h-[40px] flex items-center justify-start px-2 inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Amount
      </div>
      <div
        v-if="tab === 'Funds'"
        class="md:col-span-6 h-[40px] flex items-center justify-start px-2 inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Address
      </div>
      <div
        v-if="tab === 'Points'"
        class="md:col-span-8 h-[40px] flex items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Activity
      </div>
      <div
        v-if="tab === 'Points'"
        class="md:col-span-2 h-[40px] flex items-center justify-start px-2 inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        Point
      </div>
    </div>
    <div
      class="grid px-2 border-t-[1px] border-t-[#27272A] hover:bg-[#18181B]"
      :class="
        tab === 'Funds'
          ? 'md:grid-cols-12 grid-cols-4'
          : tab === 'Bettings'
            ? 'md:grid-cols-12 grid-cols-5'
            : 'md:grid-cols-12 grid-cols-3'
      "
      v-for="(item, index) in logs"
      :key="index"
    >
      <!-- date -->
      <div
        class="md:col-span-2 py-2 break-all flex items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[400] text-[#E4E4E7]"
      >
        <span>
          {{ formatTimestamp(item.date * 1000) }}
        </span>
      </div>
      <!-- marekt id -->
      <div
        v-if="tab == 'Bettings'"
        class="md:col-span-5 flex break-all items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[400] text-[#E4E4E7] cursor-pointer"
        @click="$router.push(`/market/${item.market_id}`)"
      >
        <span>
          {{ item.market && item.market[0] }}
        </span>
      </div>
      <!-- option id -->
      <div
        v-if="tab == 'Bettings'"
        class="md:col-span-2 flex items-center break-all justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[400] text-[#E4E4E7]"
      >
        <span>
          {{ item.option && item.option[0] }}
        </span>
      </div>
      <!-- type -->
      <div
        v-if="tab != 'Points'"
        class="md:col-span-1 flex capitalize break-all items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[400] text-[#E4E4E7]"
      >
        <span>
          {{ item.types && Object.keys(item.types)[0].toLowerCase() }}
        </span>
      </div>
      <!-- amount -->
      <div
        v-if="tab !== 'Points'"
        :class="
          tab === 'Funds' ? 'md:col-span-2 border-r-[1px] border-r-[#27272A]' : 'md:col-span-2'
        "
        class="flex items-center break-all justify-start px-2 inter text-[14px] font-[400] text-[#E4E4E7]"
      >
        <span>
          {{
            tab === 'Funds'
              ? isBtc
                ? Number(item.amount).toFixed(8)
                : (convertSats2Btc(Number(item.amount)) * btcPrice).toFixed(2)
              : isBtc
                ? convertSats2Btc(Number(item.total_amount)).toFixed(8)
                : (convertSats2Btc(Number(item.total_amount)) * btcPrice).toFixed(2)
          }}
        </span>
      </div>
      <!-- address -->
      <div
        v-if="tab === 'Funds'"
        class="md:col-span-6 flex items-center justify-start px-2 inter text-[14px] font-[400] text-[#E4E4E7]"
      >
        <span>
          {{ item.address && item.address[0] && item.address[0] }}
        </span>
      </div>
      <!-- activity -->
      <div
        v-if="tab === 'Points'"
        class="md:col-span-8 break-all flex items-center justify-start px-2 border-r-[1px] border-r-[#27272A] inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        <span>
          {{ item.content }}
        </span>
      </div>
      <!-- point -->
      <div
        v-if="tab === 'Points'"
        class="md:col-span-2 break-all flex items-center justify-start px-2 inter text-[14px] font-[500] text-[#FAFAFA]"
      >
        <span>
          {{ item.point }}
        </span>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex items-center justify-center gap-2 w-full border-t-[1px] border-t-[#27272A] leading-[40px]"
    >
      <p class="text-center text-[#FAFAFA] inter font-[400] text-[14px]">Loading</p>
      <Icon icon="eos-icons:bubble-loading" color="#FAFAFA" width="16" height="16" />
    </div>
    <div v-else-if="logs.length == 0" class="flex items-center justify-center w-full">
      <p
        class="w-full border-t-[1px] border-t-[#27272A] leading-[40px] text-center text-[#FAFAFA] inter font-[400] text-[14px]"
      >
        No records
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useHelpers } from '@/composables/useHelpers'
import { useMarketStore } from '@/stores/market'
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
const { convertSats2Btc, formatTimestamp } = useHelpers()
const marketStore = useMarketStore()
const { btcPrice } = storeToRefs(marketStore)
const { isBtc } = storeToRefs(layoutStore)

defineProps<{
  tab: string
}>()

const authStore = useAuthStore()
const { profile, backendActor } = storeToRefs(authStore)
const isLoading = ref(false)
const actor = backendActor.value

interface Log {
  owner: string
  date: number
  market_id: string[]
  market: string[]
  option_id: number[]
  option: string[]
  types: object[]
  total_amount: number[]
  content: string[]
  amount: number[]
  address: string[]
  point: number[]
}

const logs = ref<Log[]>([])

// onBeforeMount(async () => {
//   logs.value = []
//   if (props.tab == 'Funds') getFundLogs()
//   else if (props.tab == 'Bettings') getBettingLogs()
//   else getPointLogs()
// })

// watch(
//   () => props.tab,
//   async () => {
//     logs.value = []
//     if (props.tab == 'Funds') getFundLogs()
//     else if (props.tab == 'Bettings') getBettingLogs()
//     else if (props.tab == 'Points') getPointLogs()
//   }
// )

// const getFundLogs = async () => {
//   if (!profile.value) return

//   isLoading.value = true
//   let fundlogs = (await actor.get_fund_activity_logs(profile.value.nanoid)) as Log[]
//   fundlogs.sort((a, b) => b.date - a.date)
//   logs.value = fundlogs
//   isLoading.value = false
// }

// const getBettingLogs = async () => {
//   if (!profile.value) return
//   isLoading.value = true
//   let bettinglogs = (await actor.get_betting_activity_logs(profile.value.nanoid)) as Log[]
//   bettinglogs.sort((a, b) => b.date - a.date)
//   logs.value = bettinglogs
//   isLoading.value = false
// }

// const getPointLogs = async () => {
//   if (!profile.value) return
//   isLoading.value = true
//   let pointslogs = (await actor.get_point_activity_logs(profile.value.nanoid)) as Log[]
//   pointslogs.sort((a, b) => b.date - a.date)
//   logs.value = pointslogs
//   isLoading.value = false
// }
</script>
