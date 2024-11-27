<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="flex flex-col gap-[20px]">
      <div class="flex items-start gap-[20px] justify-between">
        <div class="w-[265px]">
          <form-input placeholder="Search logs" v-model="search">
            <template #prefix>
              <Icon icon="icon-park-outline:search" color="#A1A1A9" width="22" height="22" />
            </template>
          </form-input>
        </div>
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
            <div
              class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700"
            >
              <button
                v-for="(filter, index) in filters"
                class="flex flex-row gap-1 inter text-neutral-200 w-[83px] p-1 text-[12px] font-medium leading-4 rounded-lg text-left"
                :class="selectedFilter === filter ? 'bg-neutral-800' : 'hover:bg-neutral-800'"
                @click="async () => await getFundLogs(filter)"
                :key="index"
              >
                <Icon
                  v-if="FILTER_ICONS[filter]"
                  :icon="FILTER_ICONS[filter]"
                  color="#E4E4E7"
                  width="16"
                  height="16"
                  class="flex-shrink-0"
                />
                <span>{{ filter }}</span>
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
                  {{ sort.title }}
                </span>
              </button>
            </div>
          </dropdown>
        </div>
      </div>
      <div v-if="isLoading">
        <p class="text-neutral-50 text-[20px] font-medium space-grotesk leading-10 text-center">
          Loading...
        </p>
      </div>
      <Log
        v-else-if="logs.length > 0"
        v-for="(log, index) in logs"
        :key="index"
        :log="log"
        :FILTER_TYPES="FILTER_TYPES"
      />
      <div v-else>
        <p class="text-neutral-50 text-[20px] font-medium space-grotesk leading-10 text-center">
          Log is empty!
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Log from './Log.vue'
import { ref, onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { Icon } from '@iconify/vue'
import { Principal } from '@dfinity/principal'
import type { FundLog } from '@/types/notificationTypes'
import type { ActivityType } from '@/backend/betbtc-backend.did'
import FormInput from '@/components/form/Input.vue'

const authStore = useAuthStore()
const { backendActor, userPrincipal } = storeToRefs(authStore)
const isLoading = ref(false)
const actor = backendActor.value
const logs = ref<FundLog[]>([])
const search = ref<string>('')

const FILTER_TYPES = {
  ALL: 'All',
  DEPOSIT: 'Deposit',
  TRANSFER: 'Transfer',
  WITHDRAW: 'Withdraw'
}
const FILTER_ICONS = {
  [FILTER_TYPES.ALL]: 'material-symbols-light:border-all-rounded',
  [FILTER_TYPES.DEPOSIT]: 'bx:coin-stack',
  [FILTER_TYPES.TRANSFER]: 'octicon:arrow-switch-24',
  [FILTER_TYPES.WITHDRAW]: 'ph:currency-dollar'
}
const SORT_TYPE = {
  TIME: 'Time',
  AMOUNT: 'Amount'
}
const sorts = ref<
  {
    slug: string
    title: string
    icon: string
  }[]
>([
  {
    slug: SORT_TYPE.TIME,
    title: SORT_TYPE.TIME,
    icon: 'lucide:calendar'
  },
  {
    slug: SORT_TYPE.AMOUNT,
    title: SORT_TYPE.AMOUNT,
    icon: 'iconoir:coins'
  }
])
const selectedSort = ref<string>()

const filters = ref<string[]>(Object.values(FILTER_TYPES))
const selectedFilter = ref<string>(FILTER_TYPES.ALL)

const onSelectSort = (sort: string) => {
  selectedSort.value = sort

  switch (sort) {
    case SORT_TYPE.TIME:
      logs.value.sort((a: any, b: any) => b.date - a.date)
      break
    case SORT_TYPE.AMOUNT:
      logs.value.sort((a: any, b: any) => b.amount - a.amount)
      break

    default:
      break
  }
}

const getFundLogs = async (filter: string) => {
  try {
    isLoading.value = true
    selectedFilter.value = filter

    let filterArr: ActivityType[] = []
    switch (filter) {
      case FILTER_TYPES.ALL:
        filterArr = [{ Deposit: null }, { Send: null }, { Receive: null }, { Withdraw: null }]
        break
      case FILTER_TYPES.DEPOSIT:
        filterArr = [{ Deposit: null }]
        break
      case FILTER_TYPES.TRANSFER:
        filterArr = [{ Send: null }, { Receive: null }]
        break
      case FILTER_TYPES.WITHDRAW:
        filterArr = [{ Withdraw: null }]
        break

      default:
        break
    }

    logs.value = (await actor.get_fund_activity_logs(
      Principal.from(userPrincipal.value),
      filterArr
    )) as FundLog[]
  } catch (error) {
    console.error('error ======> ', error)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(async () => {
  await getFundLogs(FILTER_TYPES.ALL)
})
</script>
