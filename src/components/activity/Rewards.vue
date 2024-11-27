<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div class="flex flex-col gap-8">
      <div class="flex items-start justify-end">
        <!-- <form-input placeholder="Search rewards" v-model="searchReward" class="max-w-[265px]">
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
            <div
              class="flex flex-col gap-3 bg-neutral-950 p-2 rounded-xl border border-neutral-700"
            >
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
      <reward-option v-for="(reward, index) in rewards" v-bind="reward" :key="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RewardOption from './RewardOption.vue'
import type { Reward } from '../../types/notificationTypes'
import { ref, onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import FormInput from '@/components/form/Input.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { Icon } from '@iconify/vue'
import { Principal } from '@dfinity/principal'
import type { ActivitySortType, ActivityType } from '@/backend/betbtc-backend.did'

const authStore = useAuthStore()
const { profile, backendActor } = storeToRefs(authStore)
const isLoading = ref(false)
const actor = backendActor.value
const rewards = ref<Reward[]>([])
const searchReward = ref<string>('')

// const sorts = ref<
//   {
//     slug: string
//     title: string
//     icon: string
//   }[]
// >([
//   {
//     slug: 'time',
//     title: 'time',
//     icon: 'lucide:calendar'
//   },
//   {
//     slug: 'invites',
//     title: 'invites',
//     icon: 'streamline:user-add-plus'
//   },
//   {
//     slug: 'bets',
//     title: 'bets',
//     icon: 'ep:pie-chart'
//   },
//   {
//     slug: 'wins',
//     title: 'wins',
//     icon: 'iconoir:arrow-up-right'
//   },
//   {
//     slug: 'losses',
//     title: 'losses',
//     icon: 'iconoir:arrow-down-right'
//   },
//   {
//     slug: 'deposits',
//     title: 'deposits',
//     icon: 'lucide-lab:coins-stack'
//   }
// ])

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
    title: 'Point',
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
    slug: 'Bet',
    title: 'Bet'
  },
  {
    slug: 'Deposit',
    title: 'Deposit'
  },
  {
    slug: 'Win',
    title: 'Wins'
  },
  {
    slug: 'Loss',
    title: 'Losses'
  },
  {
    slug: 'Invite',
    title: 'Invite'
  }
])

const selectedFilter = ref<string>('')

const filterParam = ref<ActivityType[]>([
  { Invite: null },
  { Yes: null },
  { No: null },
  { Deposit: null },
  { Win: null },
  { Loss: null }
])
const sortParam = ref<ActivitySortType>({ Time: null })

const onSelectFilter = (filter: any) => {
  selectedFilter.value = filter
  if (filter == 'Bet') {
    filterParam.value = [{ Yes: null }, { No: null }]
  } else {
    filterParam.value = [{ [filter]: null } as ActivityType]
  }
  getPointLogs()
}

const onSelectSort = (sort: string) => {
  selectedSort.value = sort
  sortParam.value = { [sort]: null } as ActivitySortType
  getPointLogs()
}

onBeforeMount(() => {
  getPointLogs()
})

const getPointLogs = async () => {
  if (!profile.value) return
  isLoading.value = true
  let rewardActivities = (await actor.get_reward_activity(
    Principal.fromText(profile.value.id),
    filterParam.value,
    sortParam.value
  )) as Reward[]
  rewards.value = rewardActivities
  isLoading.value = false
}
</script>
