<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col gap-8">
    <div class="flex items-start justify-end">
      <!-- <form-input placeholder="Search payouts" v-model="searchPayout" class="max-w-[265px]">
        <template #prefix>
          <Icon icon="icon-park-outline:search" color="#A1A1A9" width="22" height="22" />
        </template>
      </form-input> -->
      <div class="flex gap-4">
        <dropdown
          close-inside
          button-classes="flex items-center inter text-[16px] leading-[20px] text-nowrap text-[#FEFEF1]"
          trigger="click"
        >
          <template #trigger>
            <button
              class="flex items-center border border-neutral-700 rounded-xl px-[14px] py-[6px] gap-2"
            >
              <Icon icon="fluent:filter-16-filled" color="#E4E4E7" width="16" height="16" />
              <span class="text-neutral-400 inter leading-[22px] text-[14px] font-medium">
                Filter
              </span>
            </button>
          </template>
          <div class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700">
            <button
              v-for="(filter, index) in filters"
              class="inter text-neutral-200 w-[83px] p-2 text-[12px] font-medium leading-4 rounded-lg"
              :class="selectedFilter === filter.slug ? 'bg-neutral-800' : 'hover:bg-neutral-800'"
              @click="() => onSelectFilter(filter.slug)"
              :key="index"
            >
              {{ filter.title }}
            </button>
          </div>
        </dropdown>
        <dropdown
          close-inside
          button-classes="flex items-center inter text-[16px] leading-[20px] text-nowrap text-[#FEFEF1]"
          trigger="click"
        >
          <template #trigger>
            <button
              class="flex items-center border border-neutral-700 rounded-xl px-[14px] py-[6px] gap-2"
            >
              <Icon icon="iconoir:arrow-down" color="#E4E4E7" width="16" height="16" />
              <span class="text-neutral-400 inter leading-[22px] text-[14px] font-medium">
                Sort
              </span>
              <Icon
                icon="fluent:chevron-up-down-24-regular"
                color="#E4E4E7"
                width="16"
                height="16"
              />
            </button>
          </template>
          <div class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700">
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
                {{ sort.title }}
              </span>
            </button>
          </div>
        </dropdown>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col border rounded-xl border-neutral-700 p-4 gap-4">
        <div class="flex flex-col gap-6">
          <div class="flex justify-between">
            <p class="text-neutral-200 text-[12px] leading-4 font-normal inter">Investments</p>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between">
              <p class="inter font-medium leading-[22px] text-[16px] text-neutral-400">USD</p>
              <p class="inter font-medium leading-8 text-[24px] text-neutral-200">
                ${{ investVolumeUSD }}
              </p>
            </div>
            <div class="flex justify-between">
              <p class="inter font-medium leading-[22px] text-[16px] text-neutral-400">BTC</p>
              <p class="inter font-medium leading-8 text-[24px] text-neutral-200">
                {{ payoutActivity?.investVolume }}SAT
              </p>
            </div>
          </div>
        </div>
        <hr class="w-full border-t border-neutral-700" />
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <p class="inter font-normal leading-4 text-[12px] text-neutral-400">
              No. of bets placed
            </p>
            <p class="inter font-medium leading-5 text-[14px] text-neutral-200">
              {{ payoutActivity?.numBet }}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="inter font-normal leading-4 text-[12px] text-neutral-400">
              No. of markets bet on
            </p>
            <p class="inter font-medium leading-5 text-[14px] text-neutral-200">
              {{ payoutActivity?.numMarket }}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="inter font-normal leading-4 text-[12px] text-neutral-400">
              Max no. of bets on a market
            </p>
            <p class="inter font-medium leading-5 text-[14px] text-neutral-200">
              {{ payoutActivity?.maxNum }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-col border rounded-xl border-neutral-700 p-4 gap-4">
        <div class="flex flex-col gap-6">
          <div class="flex justify-between">
            <p class="text-neutral-200 text-[12px] leading-4 font-normal inter">Returns (so far)</p>
            <!-- <Stats stats="up" size="large" :percent="112.51" /> -->
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex justify-between">
              <p class="inter font-medium leading-[22px] text-[16px] text-neutral-400">USD</p>
              <p class="inter font-medium leading-8 text-[24px] text-neutral-200">
                ${{ returnVolumeUSD }}
              </p>
            </div>
            <div class="flex justify-between">
              <p class="inter font-medium leading-[22px] text-[16px] text-neutral-400">BTC</p>
              <p class="inter font-medium leading-8 text-[24px] text-neutral-200">
                {{ payoutActivity?.returnedVolume }}SAT
              </p>
            </div>
          </div>
        </div>
        <hr class="w-full border-t border-neutral-700" />
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <p class="inter font-normal leading-4 text-[12px] text-neutral-400">
              No. of markets yet to resolve
            </p>
            <p class="inter font-medium leading-5 text-[14px] text-neutral-200">
              {{ payoutActivity?.numResolve }}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="inter font-normal leading-4 text-[12px] text-neutral-400">
              Potential earnings
            </p>
            <p class="inter font-medium leading-5 text-[14px] text-neutral-200">
              {{ payoutActivity?.returnVolume }} S
            </p>
          </div>
          <div class="flex justify-between">
            <p class="inter font-normal leading-4 text-[12px] text-neutral-400">
              No. of markets resolved
            </p>
            <p class="inter font-medium leading-5 text-[14px] text-neutral-200">
              {{ payoutActivity?.numResolved }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-8">
      <transaction-option
        v-for="(transaction, index) in payoutActivity?.tnxs"
        v-bind="transaction"
        :key="index"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import Stats from '../icon/Stats.vue'
import type { Payout } from '../../types/notificationTypes'
import { ref, onBeforeMount, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMarketStore } from '@/stores/market'
import { useHelpers } from '@/composables/useHelpers'
import { storeToRefs } from 'pinia'
import FormInput from '@/components/form/Input.vue'
import Dropdown from '../dropdown/Dropdown.vue'
import { Principal } from '@dfinity/principal'
import TransactionOption from './TransactionOption.vue'
import type { ActivitySortType, ActivityType } from '@/backend/betbtc-backend.did'

const authStore = useAuthStore()
const { profile, backendActor } = storeToRefs(authStore)
const { btcPrice } = storeToRefs(useMarketStore())
const { nFormatter, convertSats2Btc } = useHelpers()

const isLoading = ref(false)
const actor = backendActor.value
const payoutActivity = ref<Payout>()
const searchPayout = ref<string>('')

const investVolumeUSD = computed(() => {
  return nFormatter(
    payoutActivity.value?.investVolume
      ? (convertSats2Btc(payoutActivity.value?.investVolume) * btcPrice.value).toFixed(2)
      : 0,
    1
  )
})
const returnVolumeUSD = computed(() => {
  return nFormatter(
    payoutActivity.value?.returnedVolume
      ? (convertSats2Btc(payoutActivity.value?.returnedVolume) * btcPrice.value).toFixed(2)
      : 0,
    1
  )
})

const sorts = ref<
  {
    slug: string
    title: string
    icon: string
  }[]
>([
  {
    slug: 'Time',
    title: 'Time',
    icon: 'lucide:calendar'
  },
  {
    slug: 'Amount',
    title: 'Betting',
    icon: 'iconoir:coins'
  },
  {
    slug: 'Earning',
    title: 'Earning',
    icon: 'iconoir:coins'
  }
])

const selectedSort = ref<string>('')

const filters = ref<
  {
    slug: string
    title: string
  }[]
>([
  {
    slug: 'Win',
    title: 'Win'
  },
  {
    slug: 'Loss',
    title: 'Loss'
  },
  {
    slug: 'Yes',
    title: 'Bet Yes'
  },
  {
    slug: 'No',
    title: 'Bet No'
  }
])

const selectedFilter = ref<string>('')

const onSelectFilter = (filter: any) => {
  selectedFilter.value = filter
  console.log(filter)
  getPayouts(
    [{ [selectedFilter.value]: null } as ActivityType],
    selectedSort.value ? ({ [selectedSort.value]: null } as ActivitySortType) : { Time: null }
  )
}

const onSelectSort = (sort: string) => {
  selectedSort.value = sort
  console.log(sort)
  getPayouts(selectedFilter.value ? [{ [selectedFilter.value]: null } as ActivityType] : [], {
    [sort]: null
  } as ActivitySortType)
}

onBeforeMount(() => {
  getPayouts([], { Time: null })
})

const getPayouts = async (filter: [ActivityType] | [], sort: ActivitySortType) => {
  if (!profile.value) return
  isLoading.value = true
  payoutActivity.value = await actor.get_payout_activity(
    Principal.fromText(profile.value.id),
    filter,
    sort
  )
  isLoading.value = false
}
</script>
