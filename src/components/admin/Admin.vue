<!-- eslint-disable vue/multi-word-component-names -->
<template class="">
  <div class="p-2 bg-[#18181B] w-full">
    <div
      ref="keyboard"
      class="relative bg-[#121212] rounded-[12px] border-[#27272A] border-[1px] flex flex-col gap-8 w-full pb-12 pt-[32px] px-5 md:px-8 lg:px-16"
    >
    <div class="flex flex-col gap-[32px] max-w-[1024px]">
      <div class="flex items-center justify-between flex-wrap">
        <p class="space-grotesk font-[500] text-[32px] leading-[40px] text-[#FAFAFA]">
          Admin Settings
        </p>
        <BalanceSwitch/>
      </div>
        <div
          class="sm:px-6 px-4 py-3 flex gap-2 rounded-[12px] w-fit border-[1px] border-[#3F3F45]"
        >
          <div
            class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
            :class="duration == DAY ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'"
            @click="() => (duration = DAY)"
          >
            <p class="inter font-[500] text-[14px] leading-[20px]">Day</p>
          </div>
          <div
            class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
            :class="
              duration == 'week' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
            "
            @click="() => (duration = WEEK)"
          >
            <p class="inter font-[500] text-[14px] leading-[20px]">Week</p>
          </div>
          <div
            class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
            :class="
              duration == 'week' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
            "
            @click="() => (duration = '2weeks')"
          >
            <p class="inter font-[500] text-[14px] leading-[20px]">2 Weeks</p>
          </div>
          <div
            class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
            :class="
              duration == 'month' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
            "
            @click="() => (duration = 'month')"
          >
            <p class="inter font-[500] text-[14px] leading-[20px]">Month</p>
          </div>
          <div
            class="px-3 sm:px-4 py-[6px] rounded-[8px] cursor-pointer hover:bg-[#27272A]"
            :class="
              duration == 'all' ? 'bg-[#27272A] text-[#E4E4E7]' : 'bg-[#18181B] text-[#A1A1A9]'
            "
            @click="() => (duration = 'all')"
          >
            <p class="inter font-[500] text-[14px] leading-[20px]">All</p>
          </div>
        </div>
        <div class="flex w-full max-w-[1024px] lg:flex-row flex-col gap-[16px]">
          <div
            class="xl:w-1/3 lg:w-1/2 w-full justify-between flex flex-col gap-[16px] border-[1px] border-[#3F3F45] rounded-[12px] p-[16px]"
          >
            <div class="flex flex-row inter items-center justify-between">
              <div class="flex flex-row gap-[8px]">
                <p class="text-[16px] leading-[22px] text-[#E4E4E7] font-normal">Volume Traded</p>
              </div>
            </div>
            <div class="flex flex-col gap-[8px] font-medium">
              <div class="flex justify-between">
                <span class="inter text-[16px] leading-[20px] text-[#A1A1A9]">USD</span>
                
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="space-grotesk text-[24px] leading-[32px] text-[#E4E4E7]">{{
                  totalVolumeUSD.toFixed(2)
                }} $</span>
              </div>
              <div class="flex justify-between">
                <span class="inter text-[16px] leading-[20px] text-[#A1A1A9]">BTC</span>
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="space-grotesk text-[24px] leading-[32px] text-[#E4E4E7]">
                  {{ data?.totalVolume ? convertSats2Btc(Number(data.totalVolume)) : 0 }} BTC
                </span>
              </div>
            </div>
          </div>
          <div
            class="xl:w-1/3 lg:w-1/2 w-full justify-between flex flex-col gap-[16px] border-[1px] border-[#3F3F45] rounded-[12px] p-[16px]"
          >
            <div class="flex flex-row inter items-center justify-between">
              <div class="flex flex-row gap-[8px]">
                <p class="text-[16px] leading-[22px] text-[#E4E4E7] font-normal">Markets & Users</p>
              </div>
            </div>
            <div class="flex flex-col gap-[10px]">
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >No. of markets (total)</span
                >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium">{{
                  data?.totalMarket
                }}</span>
              </div>
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >Total Fee</span
                >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium"
                  >{{ data?.totalFee ? convertSats2Btc(Number(data.totalFee)) : 0 }} BTC</span
                >
              </div>
            </div>
            <div class="flex flex-col gap-[10px]">
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >No. of Signup Users</span
                >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium">{{
                  data?.signUpUsers
                }}</span>
              </div>
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >Total Referrals</span
                >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium"
                  >{{ data?.totalReferrals }}</span
                >
              </div>
            </div>
          </div>
          <div
            class="xl:w-1/3 lg:w-1/2 w-full justify-between flex flex-col gap-[16px] border-[1px] border-[#3F3F45] rounded-[12px] p-[16px]"
          >
            <div class="flex flex-row inter items-center justify-between">
              <div class="flex flex-row gap-[8px]">
                <p class="text-[16px] leading-[22px] text-[#E4E4E7] font-normal">Resolutions</p>
              </div>
            </div>
            <div class="flex flex-col gap-[10px]">
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >No. of markets yet to resolve</span
                >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium">{{
                  data?.totalMarket
                }}</span>
              </div>
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >No. of markets resolved</span
                >

                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium">{{
                  data?.resolvedMarket
                }}</span>
              </div>
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >No. of markets yet to distribute earnings</span
                >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium">{{
                  data?.waitingPayout
                }}</span>
              </div>
              <div class="flex flex-row inter justify-between">
                <span class="text-[#A1A1A9] text-[12px] leading-[16px] font-normal"
                  >No. of markets earnings distributed</span
                >
                <Icon
                  v-if="isLoading"
                  icon="eos-icons:bubble-loading"
                  color="#FF9046"
                  width="20"
                  height="20"
                />
                <span v-else class="text-[#E4E4E7] text-[14px] leading-[20px] font-medium">{{
                  data?.totalPayoutsIssued
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <tabs v-model="currentTab" class="max-w-[1024px]">
        <tab name="market" title="Markets">
          <Market />
        </tab>
        <tab name="user" title="Users">
          <User />
        </tab>
        <tab name="upload" title="Upload">
          <Upload />
        </tab>
      </tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import Market from './markets/Market.vue'
import User from './users/User.vue'
import Upload from './upload/Upload.vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { type Statistic } from '@/types/statisticsTypes'
import {
  DAY_IN_MILLISEC,
  ALL,
  DAY,
  MONTH,
  MONTH_IN_MILLISEC,
  TWO_WEEK,
  TWO_WEEK_IN_MILLISEC,
  WEEK,
  WEEK_IN_MILLISEC
} from '@/constants/time'
import { useMarketStore } from '@/stores/market'
import { useHelpers } from '@/composables/useHelpers'
import BalanceSwitch from '../common/BalanceSwitch.vue'

const currentTab = ref('market')
const isLoading = ref(false)
const now = Date.now()
const { convertSats2Btc } = useHelpers()

const duration = ref('day')
const from = ref(now - DAY_IN_MILLISEC)
const to = ref(now)
const authStore = useAuthStore()
const marketStore = useMarketStore()
const { backendActor, isAdmin, profile } = storeToRefs(authStore)
const { btcPrice } = storeToRefs(marketStore)
const actor = backendActor.value
const data = ref<Statistic>()
const totalVolumeUSD = ref(0.0)


onBeforeMount(() => fetchStatistic())

watch(
  () => isAdmin.value,
  () => {
    if (isAdmin.value) {
      fetchStatistic()
    }
  }
)

watch(
  () => from.value,
  () => {
    fetchStatistic()
  }
)

watch(
  () => data.value?.totalVolume,
  () => {
    if(data.value?.totalVolume && btcPrice) {
      const sats = Number(data.value.totalVolume)
      totalVolumeUSD.value = convertSats2Btc(sats) * btcPrice.value
    }
  }
)

watch(
  () => duration.value,
  (newDuration) => {
    switch (newDuration) {
      case DAY:
        from.value = now - DAY_IN_MILLISEC
        break
      case WEEK:
        from.value = now - WEEK_IN_MILLISEC
        break
      case TWO_WEEK:
        from.value = now - TWO_WEEK_IN_MILLISEC
        break
      case MONTH:
        from.value = now - MONTH_IN_MILLISEC
        break
      case ALL:
        from.value = 0
        break
      default:
        from.value = now - DAY_IN_MILLISEC
        break
    }
  }
)

const fetchStatistic = async () => {
  isLoading.value = true
  try {
    const res = await actor.get_statistics(BigInt(from.value), BigInt(to.value))
    if ('Ok' in res) {
      data.value = res.Ok
    }
    if ('Err' in res) {
      console.log('Error: ', res.Err)
    }
  } catch (e) {
    console.log('Error: ', e)
  } finally {
    isLoading.value = false
  }
}
</script>
<style scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 10px;
}
::-webkit-scrollbar-track {
  border-radius: 0px;
  background: transparent;
}
::-webkit-scrollbar-thumb {
  border-radius: 0px;
}
</style>
